/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/*
 * ConfigObject structure:
 * {
 * 		channel_id: <channel_id>,
 * 		fflogs_username: <fflogs_username>,
 * 		fflogs_guild: <fflogs_guild>,
 * 		characters: [
 * 			{
 * 				name: <char_name>,
 * 				server: <char_server>,
 * 				realm: <char_realm>
 * 			},
 * 			{
 * 				name: <char_name>,
 * 				server: <char_server>,
 * 				realm: <char_realm>
 * 			}
 * 		]
 * }
 */

$( document ).ready(function() {    
    $("#button_addNewChar").on("click", function(e) {
    	e.preventDefault(); 
    	$(".lodestone-url-wrapper").show();
    });
});

//GLOBAL VARIABLES
//NOTE: NORMALLY I THINK THIS IS GARBAGE BUT I WANT TO FINISH THIS PROJECT
let CHANNEL_ID = 0;

const app = angular.module("configApp",[]);
app.controller("ConfigController", function($scope, $http, $compile) {
	// initialize current configuration
	
	window.Twitch.ext.onAuthorized(function(auth) {
		var parts = auth.token.split(".");
		var payload = JSON.parse(window.atob(parts[1]));
		if (payload.channel_id) {
			CHANNEL_ID = payload.channel_id;
		}
		// initialize current configuration
		$("#gettingCharDataLoading").show();
		const url = '/getChars';
		$http({
			url : url,
			method : "GET",
			params : {
				channelID: CHANNEL_ID
			}
		}).then(function successCallback(response) {
			$("#gettingCharDataLoading").hide();
			const charArr = response.data;
			// build character doms here
			if (charArr == undefined || charArr == null || charArr.length < 1) {
				// no config yet, show minimum characters message
				$(".no-chars-div").show();
			}
			else {
				// use charArr and build DOM
				charArr.forEach(function(element) {
					const charName = element.name;
		        	const serverName = element.server;
		        	const realm = element.realm;
		        	const newCharacterSyntax = '<character name="' + charName + '" server="' + serverName + '" realm="' + realm + '"></character>';
		        	const el = $compile( newCharacterSyntax )( $scope );
		        	$('.characters-wrapper').append(el);
				});
			}
		
		}, function errorCallback(response) {
			$("#gettingCharDataLoading").hide();
		});
	});
})
.directive('character', function() {
	return {
	    restrict: 'E',
	    scope: true,
	    templateUrl: 'templates/config-character-template.html',
	    link: function(scope, element, attr){
	    	scope.charName = attr.name;
	    	scope.serverName = attr.server;
		}
	};
})
.directive( 'deleteCharacterButton', function () {
  return {
	  	restrict: 'E',
	  	scope: { text: '@' },
	    template: '<a ng-click="deleteCharacter()"><img src="images/trash_icon.png"></a>',
	    controller: function ( $scope, $element, $http ) {
	    	$scope.deleteCharacter = function () {
	    		const charElement = $element.closest("character");
	    		const charName = $(charElement).attr("name");
	    		const serverName = $(charElement).attr("server");
	    		const realm = $(charElement).attr("realm");
	    		$(charElement).find(".char-wrapper").addClass("greyed-out");
	    	  	const url = '/deleteChar';
	    		$http({
	    			method: 'POST',
	    			url: url,
	    			data: $.param({channelID: CHANNEL_ID, name: charName, server: serverName, realm: realm}),
	    			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    		}).then(function successCallback(response) {
	    			charElement.remove();
	    		}, function errorCallback(response) {
	    			// TODO: show failure message (SHOULDNT HAPPEN)
	    		});
	    		// TODO: check if no characters left after deletion and show no-chars div
	      };
	    }
    };
})
.directive( 'addCharacterButton', function ( $compile, $http ) {
	return {
		restrict: 'E',
		scope: { text: '@' },
	    template: '<button ng-click="addCharacter()">Save Character</button>',
	    controller: function ( $scope, $element ) {
	    	$scope.addCharacter = function () {
	    		$("#addCharLoadingImg").show();
	    		$('.error').text(""); // clear input upon new attempt
	    		const url = '/addChar';
	    		$http({
	    			method: 'POST',
	    			url: url,
	    			data: $.param({channelID: CHANNEL_ID, lodestoneURL: $("#lodestoneURL").val()}),
	    			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    		}).then(function successCallback(response) {
	    			$(".no-chars-div").hide();
	    			const charName = response.data.name;
		        	const serverName = response.data.server;
		        	const realm = response.data.realm;
		        	const newCharacterSyntax = '<character name="' + charName + '" server="' + serverName + '" realm="' + realm + '"></character>';
		        	const el = $compile( newCharacterSyntax )( $scope );
		        	$('.characters-wrapper').append(el);
		        	$("#addCharLoadingImg").hide();
		        	
	    		}, function errorCallback(response) {
	    		    $('.error').text(response.data);
	    		    $("#addCharLoadingImg").hide();
	    		});
	    	};
	    }
    };
});