"use strict";

/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const servers = {
		"Aegis": "JP",
		"Atomos": "JP",
		"Carbuncle": "JP",
		"Garuda": "JP",
		"Gungnir": "JP",
		"Kujata": "JP",
		"Ramuh": "JP",
		"Tonberry": "JP",
		"Typhon": "JP",
		"Unicorn": "JP",
		"Alexander": "JP",
		"Bahamut": "JP",
		"Durandal": "JP",
		"Fenrir": "JP",
		"Ifrit": "JP",
		"Ridill": "JP",
		"Tiamat": "JP",
		"Ultima": "JP",
		"Valefor": "JP",
		"Yojimbo": "JP",
		"Zeromus": "JP",
		"Anima": "JP",
		"Asura": "JP",
		"Belias": "JP",
		"Chocobo": "JP",
		"Hades": "JP",
		"Ixion": "JP",
		"Mandragora": "JP",
		"Masamune": "JP",
		"Pandaemonium": "JP",
		"Shinryu": "JP",
		"Titan": "JP",
		"Adamantoise": "NA",
		"Balmung": "NA",
		"Cactuar": "NA",
		"Coeurl": "NA",
		"Faerie": "NA",
		"Gilgamesh": "NA",
		"Goblin": "NA",
		"Jenova": "NA",
		"Mateus": "NA",
		"Midgardsormr": "NA",
		"Sargatanas": "NA",
		"Siren": "NA",
		"Zalera": "NA",
		"Behemoth": "NA",
		"Brynhildr": "NA",
		"Diabolos": "NA",
		"Excalibur": "NA",
		"Exodus": "NA",
		"Famfrit": "NA",
		"Famfrit": "NA",
		"Hyperion": "NA",
		"Lamia": "NA",
		"Leviathan": "NA",
		"Malboro": "NA",
		"Ultros": "NA",
		"Cerberus": "EU",
		"Lich": "EU",
		"Louisoix": "EU",
		"Moogle": "EU",
		"Odin": "EU",
		"Omega": "EU",
		"Phoenix": "EU",
		"Ragnarok": "EU",
		"Shiva": "EU",
		"Zodiark": "EU"
};

//public methods
module.exports = {
		getByServer: function(server) {
			return servers[server];
		}
}
