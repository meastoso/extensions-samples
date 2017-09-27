"use strict";

/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const cheerio = require('cheerio');
const request = require('request');
const realm = require('./realm.js');

const parseCharacterData = function(lodestoneURL) {
	return new Promise((resolve, reject) => {
		// TODO parse here
		request(lodestoneURL, function (error, response, html) {
			const failMsg = "Could not parse URL. Please ensure correct URL and try again or contact meastoso@gmail.com";
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
				const name = $(".frame__chara__box p.frame__chara__name").text();
				const server = $(".frame__chara__box p.frame__chara__world").text();
				const realmName = realm.getByServer(server);
				if (name == undefined || name == '' || server == undefined || server == '' || realmName == undefined || realmName == '') {
					reject(failMsg);
				}
				const parsedChar = {
					name: name,
					server: server,
					realm: realmName
				};
				resolve(parsedChar);
			}
			else {
				// there was an error or statusCode was not 200
				reject(failMsg);
			}
		});
	});
};

//public methods
module.exports = {
		getParsedCharacterData: parseCharacterData
}