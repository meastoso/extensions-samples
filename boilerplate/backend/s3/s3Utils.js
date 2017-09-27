"use strict";

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

const AWS = require('aws-sdk');
//load AWS config from file
//NOTE: Could not figure out how to load proper environment details in docker
AWS.config.loadFromPath('/boilerplate/backend/credentials'); 
const s3 = new AWS.S3();
const fflogsExtensionBucket = 'meastoso-ffxiv-fflogs-extension-bucket';

// local variable used to maintain config scope
let configCache= {};

// MAINTAIN CONFIG OBJECT HERE

// turn an initialization to get any existing config object DONT ASSUME CONFIG OBJECT EXISTS YET
// ANY NUMBER OF STREAMERS WITH UNIQUE CHANNEL IDS COULD USE THIS AT ANY TIME

//this will need to be updated once we add "recent parses" feature
function getConfigObject(channel_id, characters) {
	if (characters === undefined || characters == null || characters.length < 1) {
		throw Error("Tried to cast getConfigObject with no characters");
	}
	const newObj = {
			channel_id: channel_id,
			fflogs_username: '',
			fflogs_guild: '',
			characters: characters
	}
	return newObj;
}

// TODO: validate
function getCharObject(name, server, realm) {
	return {
		name: name,
		server: server,
		realm: realm
	};
}

// returns array of characters from config object
function getCharsFromConfig(configObject) {
	return configObject.characters;
}

// updates the configObject passed in and removes the specified charObject from it
function removeCharFromConfig(configObject, charObj) {
	let tempCharArr = [];
	for (let i = 0; i < configObject.characters.length; i++) {
		const c = configObject.characters[i];
		if (c.name != charObj.name || c.server != charObj.server || c.realm != charObj.realm) {
			tempCharArr.push(c);
		}
	}
	configObject.characters = tempCharArr;
}

const getConfig = function(channel_id) {
	return new Promise((resolve, reject) => {
		let params = {Bucket: fflogsExtensionBucket, Key: channel_id};
		s3.getObject(params, function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data.Body.toString()));
			}
		});
	});
}

// shouldn't return error; array of characters or empty array if no config exists yet
//check to see if we have cached config data
// 		yes? call getCharsFromConfig()
//		no? call getConfig()
//				config exists > add to cache
//				config doesn't exist (first time setup) > return empty array of characters
const getChars = function(channel_id) {
	return new Promise((resolve, reject) => {
		const cachedConfig = configCache[channel_id];
		if (cachedConfig === undefined || cachedConfig == null) {
			getConfig(channel_id)
				.then((data) => {
					// config exists i think? TODO: check if no file in bucket could still result in success
					configCache[channel_id] = data; // add to local cache
					resolve(getCharsFromConfig(data)); // return characters
				})
				.catch((err) => {
					// file doesn't exist with channel_id key yet?
					const emptyArr = [];
					resolve(emptyArr);
				});
		}
		else {
			// config exists in cache, just resolve characters
			resolve(getCharsFromConfig(cachedConfig));
		}
	});
}

// boolean function
function charExists(charArr, charObj) {
	for (let i = 0; i < charArr.length; i++) {
		const c = charArr[i];
		if (c.name == charObj.name && c.server == charObj.server && c.realm == charObj.realm) {
			return true;
		}
	}
	return false; // did not find a match, return false
}

/*
 * get configObject from cache?
 * 		no!!!!!
 * 			- call getConfig()
 * 				- exists:
 * 					- update returned configObject with new character
 * 					- add configObject to cache
 * 					- return/resolve updatedConfigObject (will be pushed to s3 by public method)
 * 				- DOESNT exist
 * 					- create new configObject with this channel_id and single character
 * 					- add configObject to cache
 * 					- return/resolve newConfigObject  (will be pushed to s3 by public method)
 * 		yes!
 * 			- add character object to the charArr (CHECK IF IT EXISTS ALREADY AND REJECT IF SO)
 * 			- update cached configObject
 * 			- resolve/return updated configObject
 */
const addCharToConfig = function(channel_id, characterObject) {
	return new Promise((resolve, reject) => {
		const cachedConfig = configCache[channel_id];
		if (cachedConfig === undefined || cachedConfig == null) {
			getConfig(channel_id)
				.then((configObj) => {
					// config exists
					if (charExists(configObj.characters, characterObject)) {
						reject('Character already exists for this channel configuration!');
					}
					else {
						configObj.characters.push(characterObject); // update returned config object with new char
						configCache[channel_id] = configObj; // add this config object to cache
						resolve(configObj);
					}
				})
				.catch((err) => {
					// config doesn't exist yet
					const newCharArr = [characterObject];
					const newConfigObj = getConfigObject(channel_id, newCharArr);
					configCache[channel_id] = newConfigObj; // add this config object to cache
					resolve(newConfigObj);
				});
		}
		else {
			// config exists in cache, just resolve characters
			//resolve(getCharsFromConfig(cachedConfig));
			if (charExists(cachedConfig.characters, characterObject)) {
				reject('Character already exists for this channel configuration!');
			}
			else {
				cachedConfig.characters.push(characterObject); // update returned config object with new char
				configCache[channel_id] = cachedConfig; // add this config object to cache
				resolve(cachedConfig);
			}
		}
	});
}

const deleteChar = function(channel_id, characterObject) {
	return new Promise((resolve, reject) => {
		const cachedConfig = configCache[channel_id];
		if (cachedConfig === undefined || cachedConfig == null) {
			getConfig(channel_id)
				.then((configObj) => {
					// config exists
					if (charExists(configObj.characters, characterObject)) {
						//configObj.characters.push(characterObject); // update returned config object with new char
						removeCharFromConfig(configObject, characterObject);
						configCache[channel_id] = configObj; // add this config object to cache
						resolve(configObj);
					}
					else {
						reject('Character you are trying to delete does not exist'); // shouldn't happen
					}
				})
				.catch((err) => {
					// config doesn't exist yet
					reject('Cannot delete a character when a configuration does not exist yet.');
				});
		}
		else {
			// config exists in cache
			//resolve(getCharsFromConfig(cachedConfig));
			if (charExists(cachedConfig.characters, characterObject)) {
				removeCharFromConfig(cachedConfig, characterObject);
				configCache[channel_id] = cachedConfig; // add this config object to cache
				resolve(cachedConfig);
			}
			else {
				reject('Character you are trying to delete does not exist'); // shouldn't happen
			}
		}
	});
}

// public methods
module.exports = {
		addChar: function(channel_id, characterObject) {
			return new Promise((resolve, reject) => {
				// update the cached config object in this module with additional char info and push to S3
				//const updatedConfigObj = characterObject; // get this from a private function above using characterObject and channel_id
				addCharToConfig(channel_id, characterObject)
					.then((updatedConfigObj) => {
						// we got the updated char config back, update in S3
						s3.createBucket({Bucket: fflogsExtensionBucket}, function(err, data) {
							if (err) {
								reject(err);
							} else {
								let params = {Bucket: fflogsExtensionBucket, Key: channel_id, Body: JSON.stringify(updatedConfigObj)};
								s3.putObject(params, function(err, data) {
									if (err) {
										reject(err);
									} else {
										resolve('OK');
									}
								});
							}
						});
					})
					.catch((err) => {
						// something went terribly wrong!
						reject(err);
					});
			});
		},
		deleteChar: function(channel_id, characterObject) {
			return new Promise((resolve, reject) => {
				deleteChar(channel_id, characterObject)
					.then((updatedConfigObj) => {
						// we got the updated char config back, update in S3
						s3.createBucket({Bucket: fflogsExtensionBucket}, function(err, data) {
							if (err) {
								reject(err);
							} else {
								let params = {Bucket: fflogsExtensionBucket, Key: channel_id, Body: JSON.stringify(updatedConfigObj)};
								s3.putObject(params, function(err, data) {
									if (err) {
										reject(err);
									} else {
										resolve('OK');
									}
								});
							}
						});
					})
					.catch((err) => {
						// something went terribly wrong!
						reject(err);
					});
			});
		},
		getChars: getChars
}