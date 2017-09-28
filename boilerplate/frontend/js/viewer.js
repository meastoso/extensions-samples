/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/*

  Set Javascript specific to the extension viewer view in this file.

*/

//GLOBAL VARIABLES
//NOTE: NORMALLY I THINK THIS IS GARBAGE BUT I WANT TO FINISH THIS PROJECT
let CHANNEL_ID = 0;
const baseURL = "https://twitch.meastoso-backend.com";

const app = angular.module("viewerApp",['angularjs-gauge', 'ngMaterial']);
app.controller("ViewerController", function($scope, $http, $compile, $timeout, jobUtils, fflogsUtils) {
	// initialize current configuration	
	$scope.extensionOpen = false; // used to toggle extension view
	$scope.toggleShow = function() {
		$scope.extensionOpen = !$scope.extensionOpen;
	}
	$scope.charDataMap = {};
	
	$scope.showBody = false; // used to toggle body content
	$scope.clickJob = function(jobStr, charStr, serverStr) {
		$scope.showBody = true;
		$(".job-char-server-wrapper").hide(); // hide all
		$('.job-char-server-wrapper[data-job="' + jobStr + '"][data-char="' + charStr + '"][data-server="' + serverStr + '"]').show();
		// job menus
		$(".job-menu-small .char-jobs").hide();
		$(".job-menu-small .char-jobs[data-char=\"" + charStr + "\"][data-server='" + serverStr + "']").show();
		// animate the shown item
		$timeout(function() {
			// Format is: id="{{jobName}}-{{charName}}-{{serverName}}"
			const charNameNoSpaces = charStr.replace(/\s/g, '').replace(/'/g, '');
			angular.element('#' + jobStr + '-' + charNameNoSpaces + '-' + serverStr).triggerHandler('click');
		});
	}
	
	window.Twitch.ext.onAuthorized(function(auth) {
		var parts = auth.token.split(".");
		var payload = JSON.parse(window.atob(parts[1]));
		if (payload.channel_id) {
			CHANNEL_ID = payload.channel_id;
		}
		// initialize current configuration
		// TODO loop for each character
		// first get all the characters configured by this channel
		const getCharsURL = baseURL + '/getChars';
		$http({
			url : getCharsURL,
			method : "GET",
			params : {
				channelID: CHANNEL_ID
			}
			}).then(function successCallback(response) {
				const charArr = response.data;
				const getSummaryForCharURL = baseURL + '/getSummaryForChar';
				charArr.forEach(function(char) {
					$http({
						url : getSummaryForCharURL,
						method : "GET",
						params : {
							charName: char.name,
							serverName: char.server,
							realmName: char.realm
						}
					}).then(function successCallback(response) {
						if (response !== undefined && response.data !== undefined && response.data.length > 0 && Object.prototype.toString.call( response.data ) === '[object Array]' ) {
							const charSummary = response.data;
							const namePlusServer = char.name + '-' + char.server; // this is garbage don't ever do this again
							$scope.charDataMap[namePlusServer] = charSummary;
							
							// draw char-panels, append job buttons based on summary
							const jobArr = fflogsUtils.getJobArr(charSummary); // unique set of jobs for this character
							$scope.charSummary = charSummary;
							let jobArrGarbageVariable = '';
							for (let i = 0; i < jobArr.length; i++) {
								jobArrGarbageVariable = jobArrGarbageVariable + jobArr[i] + '-';
							}
							jobArrGarbageVariable = jobArrGarbageVariable.slice(0, -1);
							const charPanelSyntax = '<char-panel char="' + char.name + '" server="' + char.server + '" jobs="' + jobArrGarbageVariable + '"></char-panel>';
							let charPanel = $compile( charPanelSyntax )( $scope );
							$('.characters-wrapper').append(charPanel);
							
							// draw body-content for each job/char combo
							for (let i = 0; i < jobArr.length; i++) {
								const summaryContentSyntax = '<summary-content job="' + jobArr[i] + '" char="' + char.name + '" server="' + char.server + '"></summary-content>';
								const summaryContent = $compile( summaryContentSyntax )( $scope );
								$('.body-content').append(summaryContent);
							}
							
							// draw "small" jobs left-menu
							const charJobsSyntax = '<char-jobs char="' + char.name + '" server="' + char.server + '" jobs="' + jobArrGarbageVariable + '"></char-panel>';
							let charJobs = $compile( charJobsSyntax )( $scope );
							$('.job-menu-small').append(charJobs);
						}
						else {
							// something went wrong fetching data from fflogs, maybe 
							// wrong character info or the character doesn't exist in fflogs
							const charPanelSyntax = '<char-panel char="' + char.name + '" server="' + char.server + '" fail="true" jobs=""></char-panel>';
							let charPanel = $compile( charPanelSyntax )( $scope );
							$('.characters-wrapper').append(charPanel);
						}
					
					}, function errorCallback(response) {
						// something went wrong fetching data from fflogs, maybe 
						// wrong character info or the character doesn't exist in fflogs
						const charPanelSyntax = '<char-panel char="' + char.name + '" server="' + char.server + '" fail="true" jobs=""></char-panel>';
						let charPanel = $compile( charPanelSyntax )( $scope );
						$('.characters-wrapper').append(charPanel);
					});
				});
			}, function errorCallback(response) {
				// something went SUPER wrong here! Nothing to really show?
			});
	});
})
.directive('jobButton', function() {
	return {
	    restrict: 'E',
	    scope: true,
	    templateUrl: 'templates/job-button-template.html',
	    link: function(scope, element, attr){
	    	scope.jobName = attr.job;
	    	scope.charName = attr.char;
	    	scope.serverName = attr.server;
		}
	};
})
.directive('summaryContent', function(fflogsUtils) {
	return {
	    restrict: 'E',
	    scope: true,
	    templateUrl: 'templates/body-content-template.html',
	    link: function(scope, element, attr){
	    	scope.jobName = attr.job;
	    	scope.charName = attr.char;
	    	scope.serverName = attr.server;
	    	// build this specific directive's gauge objects
	    	const namePlusServer = attr.char + '-' + attr.server;
	    	const charSummary = scope.$parent.charDataMap[namePlusServer];
	    	scope.summaryData = fflogsUtils.getSummaryForJob(attr.job, charSummary);
	    	scope.threshold = {
	    			'0': {color: '#aaa'}, /* grey */
	    			'25': {color: 'rgb(30, 255, 0)'}, /* green */
	    			'50': {color: 'rgb(0, 112, 255)'}, /* blue */
	    			'75': {color: 'rgb(163, 53, 238)'}, /* purple */
	    			'95': {color: 'rgb(255, 128, 0)'}, /* orange */
	    			'99': {color: 'rgb(229, 204, 128)'} /* gold */
			};
	    	
	    	scope.triggerAnimation = function() {
	    		//const tempVal = parseInt(scope.summaryData[0].percentile) + 1;
	    		//scope.summaryData[0].percentile = tempVal;
	    		scope.summaryData.forEach(function(element) {
	    			const tempVal = parseInt(element.percentileMinusOne) + 1;
	    			element.displayPercentile = tempVal;
	    		});
	    	}
	    	scope.getCharNameNoSpaces = function() {
	    		const theChar = attr.char;
	    		return theChar.replace(/\s/g, '').replace(/'/g, '');
	    	}
		}
	};
})
.directive('charPanel', function() {
	return {
	    restrict: 'E',
	    scope: true,
	    templateUrl: 'templates/char-panel-template.html',
	    link: function(scope, element, attr){
	    	scope.charName = attr.char;
	    	scope.serverName = attr.server;
	    	scope.jobsArr = attr.jobs.split('-');
	    	if (attr.fail == 'true') {
	    		scope.fail = true;
	    	}
		}
	};
}).directive('charJobs', function() {
	return {
	    restrict: 'E',
	    scope: true,
	    templateUrl: 'templates/char-jobs-template.html',
	    link: function(scope, element, attr){
	    	scope.charName = attr.char;
	    	scope.serverName = attr.server;
	    	scope.jobsArr = attr.jobs.split('-');
		}
	};
});