"use strict";

/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const Client = require('node-rest-client').Client;
const client = new Client();
const getSummaryForChar = function(parsedChar) {
	return new Promise((resolve, reject) => {
		const url = "https://www.fflogs.com/v1/parses/character/" + parsedChar.name + "/" + parsedChar.server + "/" + parsedChar.realm + "?api_key=69877c577f4d83c07746b20a5ebb6e1c";
		console.log('url being used is:');
		console.log(url);
		client.get(url, function (data, response) {
		    resolve(data);
		});
	});
};

//public methods
module.exports = {
		getSummaryForChar: getSummaryForChar
}

