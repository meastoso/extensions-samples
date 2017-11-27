angular.module('viewerApp').service('jobUtils', function() {
    /*const jobMap = {
    		1: "AST",
    		2: "BRD",
    		3: "BLM",
    		4: "DRK",
    		5: "DRG",
    		6: "MCH",
    		7: "MNK",
    		8: "NIN",
    		9: "PLD",
    		10: "SCH",
    		11: "SMN",
    		12: "WAR",
    		13: "WHM",
    		14: "RDM",
    		15: "SAM"
    };*/
    const jobNameMap = {
    		"Astrologian": "AST",
    		"Bard": "BRD",
    		"BlackMage": "BLM",
    		"DarkKnight": "DRK",
    		"Dragoon": "DRG",
    		"Machinist": "MCH",
    		"Monk": "MNK",
    		"Ninja": "NIN",
    		"Paladin": "PLD",
    		"Scholar": "SCH",
    		"Summoner": "SMN",
    		"Warrior": "WAR",
    		"WhiteMage": "WHM",
    		"RedMage": "RDM",
    		"Samurai": "SAM"
    };
    // create inverse map for faster lookups
    const specMap = {};
    for (let spec in jobNameMap) {
	    if (jobNameMap.hasOwnProperty(spec)) {
	    	//jobArr.push(jobUtils.getJobAcronymFromSpec(spec));
	    	specMap[jobNameMap[spec]] = spec;
	    }
	}
    
    this.getJobAcronymFromSpec = function(fflogsJobSpec) {
    	return jobNameMap[fflogsJobSpec];
    }
    
    this.getSpecFromJobAcronym = function(fflogsJobAcronym) {
    	return specMap[fflogsJobAcronym];
    }
});