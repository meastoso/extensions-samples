angular.module('viewerApp').service('jobUtils', function() {
    const jobMap = {
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
    }
    // create inverse map for faster lookups
    const specMap = {};
    for (let spec in jobMap) {
	    if (jobMap.hasOwnProperty(spec)) {
	    	//jobArr.push(jobUtils.getJobAcronymFromSpec(spec));
	    	specMap[jobMap[spec]] = spec;
	    }
	}
    
    this.getJobAcronymFromSpec = function(fflogsJobSpec) {
    	return jobMap[fflogsJobSpec];
    }
    
    this.getSpecFromJobAcronym = function(fflogsJobAcronym) {
    	return specMap[fflogsJobAcronym];
    }
});