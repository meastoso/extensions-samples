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

const app = angular.module("viewerApp",['angularjs-gauge', 'ngMaterial']);
app.controller("ViewerController", function($scope, $http, $compile, jobUtils, fflogsUtils) {
	// initialize current configuration
	console.log("loading authorized");
	
	$scope.extensionOpen = false; // used to toggle extension view
	$scope.toggleShow = function() {
		$scope.extensionOpen = !$scope.extensionOpen;
	}
	
	$scope.showBody = false; // used to toggle body content
	$scope.clickJob = function(jobStr, charStr, serverStr) {
		console.log('got to clickJob with: ' + jobStr + ' ' + charStr + ' ' + serverStr);
		// TODO: implement
		$scope.showBody = true;
		$(".job-char-server-wrapper").hide(); // hide all
		$(".job-char-server-wrapper[data-job='" + jobStr + "'][data-char='" + charStr + "'][data-server='" + serverStr + "']").show();
		// job menus
		$(".job-menu-small .char-jobs").hide();
		$(".job-menu-small .char-jobs[data-char='" + charStr + "'][data-server='" + serverStr + "']").show();
	}
	
	window.Twitch.ext.onAuthorized(function(auth) {
		var parts = auth.token.split(".");
		var payload = JSON.parse(window.atob(parts[1]));
		if (payload.channel_id) {
			CHANNEL_ID = payload.channel_id;
		}
		// initialize current configuration
		// TODO loop for each character
		const url = '/getSummaryForChar';
		$http({
			url : url,
			method : "GET",
			params : {
				charName: 'Meastoso Disperde',
				serverName: 'Behemoth',
				realmName: 'NA'
			}
		}).then(function successCallback(charSummary) {
			console.log('initialization of getSummaries success');
			if (Object.prototype.toString.call( charSummary ) === '[object Array]' ) {
				// TODO: draw up this character's summary here
				
			}
			else {
				// something went wrong fetching data from fflogs, maybe 
				// wrong character info or the character doesn't exist in fflogs
				// TODO: show error message in view here
			}
			console.log(charSummary);
		
		}, function errorCallback(response) {
			console.log('initialization of getConfig failed!');
			console.log(response);
			//$("#gettingCharDataLoading").hide();
		});
		console.log("viewer controller loaded ok!");
	});
	
	// TODO: DELETE THIS AFTER TESTING WITHOUT THE STREAM ON
	CHANNEL_ID = '51673052'; // hardcoded twitch.tv/meastoso
	
	// first get all the characters configured by this channel
	const getCharsURL = '/getChars';
	$http({
		url : getCharsURL,
		method : "GET",
		params : {
			channelID: CHANNEL_ID
		}
		}).then(function successCallback(response) {
			console.log('initialization of getChars success');
			console.log(response);
			const charArr = response.data;
			// build character doms here
			// first add main-page character blocks
			// second add summary-jobs small-menu
			// third call getSummaries for each char
			//		- create body-content for each character-job combo of all characters
			// for each character, go get the summaries and populate here
			const getSummaryForCharURL = '/getSummaryForChar';
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
					const charSummary = response.data;
					console.log('initialization of getSummaries success');
					if (Object.prototype.toString.call( charSummary ) === '[object Array]' ) {
						// TODO: draw up this character's summary here
						console.log('YES ITS AN ARRAY!');
						
						// draw char-panels, append job buttons based on summary
						const jobArr = fflogsUtils.getJobArr(charSummary); // unique set of jobs for this character
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
						// TODO: show error message in view here
						console.log('NO! ITS NOT AN ARRAY!');
						console.log(char);
						// TODO: show "No FFLogs data for this character!" message
					}
					console.log(charSummary);
				
				}, function errorCallback(response) {
					console.log('initialization of getConfig failed!');
					console.log(response);
					//$("#gettingCharDataLoading").hide();
				});
			});
		}, function errorCallback(response) {
			console.log('initialization of getChars failed!');
			console.log(response);
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
.directive('summaryContent', function() {
	return {
	    restrict: 'E',
	    scope: true,
	    templateUrl: 'templates/body-content-template.html',
	    link: function(scope, element, attr){
	    	scope.jobName = attr.job;
	    	scope.charName = attr.char;
	    	scope.serverName = attr.server;
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