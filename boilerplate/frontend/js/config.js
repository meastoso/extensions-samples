/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/*

  Set Javascript specific to the extension configuration view in this file.

*/
$( document ).ready(function() {
    console.log( "ready!" );
    
    $("#configForm").on("submit", function(e) {
    	e.preventDefault();
    	
    	$.get( "setConfig?param1=whocares&param2=whocares2", function( data ) {
    		//$( ".result" ).html( data );
    		console.log('finished sending config!');
		});
    });
    
    $("#button_addNewChar").on("click", function(e) {
    	e.preventDefault(); 
    	$(".lodestone-url-wrapper").show();
    });
    
    $(".delete-character-anchor").on("click", function(e) {
    	console.log('deleting!');
    	e.preventDefault();
    	//$(this).closest("character").remove();
    });
    
});

const app = angular.module("configApp",[]);
app.controller("ConfigController", function($scope) {
  //$scope.message = "Hello, AngularJS";
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
	    controller: function ( $scope, $element ) {
	      $scope.deleteCharacter = function () {
	    	  console.log('clicked delete!');
	    	  $element.closest("character").remove();
	      };
	    }
    };
})
.directive( 'addCharacterButton', function ( $compile ) {
  return {
	  restrict: 'E',
	  scope: { text: '@' },
	    template: '<button ng-click="addCharacter()">Save Character</button>',
	    controller: function ( $scope, $element ) {
	      $scope.addCharacter = function () {
	    	// TODO: go to EBS (backend), parse URL for character info and save
			// in S3
	    	  console.log('clicked attribute');
	    		const charName = "Another Character";
	        	const serverName = "ServerABC";
	        	const newCharacterSyntax = '<character name="' + charName + '" server="' + serverName + '"></character>';
	        	const el = $compile( newCharacterSyntax )( $scope );
	        	$('.characters-wrapper').append(el);
	      };
	    }
    };
});