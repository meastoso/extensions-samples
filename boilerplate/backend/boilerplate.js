"use strict";

/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express');
//const fs = require('fs');
//const https = require('https');
const s3Utils = require('./s3/s3Utils.js');
const loadestoneParser = require('./parser/lodestoneParser.js');
const fflogsUtils = require('./fflogs/fflogsUtils.js');

const app = express();

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return next();
});

app.use(express.static('../frontend'));

app.get('/getSummaryForChar', function (req, res) {
	const charName = req.query.charName;
	const serverName = req.query.serverName;
	const realmName = req.query.realmName;
	const parsedChar = {
			name: charName,
			server: serverName,
			realm: realmName
	};
	fflogsUtils.getSummaryForChar(parsedChar)
		.then((summaryArr) => {
			res.send(summaryArr);
		})
		.catch((err) => {
			res.status(500).send('ERROR: ' + err);
		});
	
});

app.post('/addChar', function (req, res) {
	const lodestoneURL = req.body.lodestoneURL;
	const channel_id = req.body.channelID;
	loadestoneParser.getParsedCharacterData(lodestoneURL)
		.then((parsedChar) => {
			s3Utils.addChar(channel_id, parsedChar)
			.then((data) => {
				res.send(parsedChar);
			})
			.catch((err) => {
				res.status(500).send('ERROR: ' + err);
			});
		})
		.catch((err) => {
			res.status(500).send('ERROR: ' + err);
		});
});

app.post('/deleteChar', function (req, res) {
	const name = req.body.name;
	const server = req.body.server;
	const realm = req.body.realm;
	const channel_id = req.body.channelID;
	const parsedChar = {
		  name: name,
		  server: server,
		  realm: realm
	}
	s3Utils.deleteChar(channel_id, parsedChar)
		.then((data) => {
			res.send(parsedChar);
		})
		.catch((err) => {
			// something went SUPER wrong
		});
});

app.get('/getChars', function (req, res) {
	const channel_id = req.query.channelID;
	s3Utils.getChars(channel_id)
		.then((data) => {
			res.send(data); // array of characters; empty if no config yet
		})
		.catch((err) => {
			// something went super wrong, should return empty array if no chars
		});
});

/*let options = {
   key  : fs.readFileSync('/boilerplate/certs/testing.key'),
   cert : fs.readFileSync('/boilerplate/certs/testing.crt')
};
const PORT = 8080;
https.createServer(options, app).listen(PORT, function () {
	// server running
});*/
let port = process.env.PORT || 3000;
let server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});