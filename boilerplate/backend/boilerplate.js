"use strict";

/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express');
const fs = require('fs');
const https = require('https');
const s3Utils = require('./s3/s3Utils.js');

const app = express();

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use((req, res, next) => {
  console.log('Got request', req.path, req.method);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return next();
});

app.use(express.static('../frontend'))

app.get('/getLeaderboard', function (req, res) {
	const leaderBoard = [
		{ 'rank': 1, 'name': 'aprilk', 'score': '124', 'percentCorrect': '80' },
		{ 'rank': 2, 'name': 'lanz', 'score': '123', 'percentCorrect': '75' },
		{ 'rank': 3, 'name': 'zaes', 'score': '122', 'percentCorrect': '70' },
		{ 'rank': 4, 'name': '1234567890123456789012345', 'score': '121', 'percentCorrect': '60' },
		{ 'rank': 5, 'name': 'meast', 'score': '120', 'percentCorrect': '50' }
	];
	res.send(leaderBoard);
});

app.post('/addChar', function (req, res) {
	const lodestoneURL = req.body.lodestoneURL;
	const channel_id = req.body.channelID;
	//TODO: go to EBS (backend), parse URL for character info and save in S3
	//res.send('ERROR: Could not parse URL. Please ensure correct URL and try again or contact meastoso@gmail.com');
	// NOTE: CHECK THE CHARACTER DOESNT ALREADY EXIST BEFORE ADDING IT, RETURN ERROR IF CHARACTER EXISTS
	// ALSO INCLUDE REGION/REALM 'NA' when storing data!
	const parsedChar = {
		  name: 'Aeal Disperde',
		  server: 'Leviathan',
		  realm: 'NA'
	}
	
	s3Utils.addChar(channel_id, parsedChar)
		.then((data) => {
			res.send(parsedChar);
			console.log('returning parsedChar data');
			console.log(data);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('ERROR: ' + err);
		});
	
	
	
	
	//s3Utils.addChar(channel_id, parsedChar).then()
	//res.send(parsedChar);
	console.log('finished addChar function');
	//res.status(500).send('ERROR: Could not parse URL. Please ensure correct URL and try again or contact meastoso@gmail.com')
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
			console.log('returning parsedChar data');
			console.log(data);
		})
		.catch((err) => {
			console.error(err);
		});
	//res.status(500).send('ERROR: Could not parse URL. Please ensure correct URL and try again or contact meastoso@gmail.com')
});

app.get('/getChars', function (req, res) {
	const channel_id = req.query.channelID;
	console.log('express getting chars for channel_id: ' + channel_id);
	s3Utils.getChars(channel_id)
		.then((data) => {
			res.send(data); // array of characters; empty if no config yet
			console.log('returning getConfig data');
			console.log(data); // data should be array of characters
		})
		.catch((err) => {
			console.error(err);
		});
});

let options = {
   key  : fs.readFileSync('/boilerplate/certs/testing.key'),
   cert : fs.readFileSync('/boilerplate/certs/testing.crt')
};

const PORT = 8080;
https.createServer(options, app).listen(PORT, function () {
  console.log('Extension Boilerplate service running on https', PORT);
});