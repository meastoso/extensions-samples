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
app.controller("ViewerController", function($scope, $http, $compile) {
	// initialize current configuration
	console.log("loading authorized");
	
	$scope.extensionOpen = false; // used to toggle extension view
	$scope.toggleShow = function() {
		$scope.extensionOpen = !$scope.extensionOpen;
	}
	
	$scope.showBody = true; // used to toggle body content
	$scope.clickJob = function(jobStr, charAndServerStr) {
		// TODO: implement
		$scope.showBody = true;
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
		
		}, function errorCallback(response) {
			console.log('initialization of getChars failed!');
			console.log(response);
		});
	
	
	
	// for each character, go get the summaries and populate here
	const getSummaryForCharURL = '/getSummaryForChar';
	$http({
		url : getSummaryForCharURL,
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
});