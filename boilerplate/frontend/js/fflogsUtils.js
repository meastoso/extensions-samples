angular.module('viewerApp').service('fflogsUtils', function(jobUtils, encounterUtils) {
    this.getJobArr = function(charSummary) {
    	const jobMap = {};
    	const jobArr = [];
    	charSummary.forEach(function(encounterSummary) {
    		jobMap[encounterSummary.spec] = 1;
    	});
    	// take map of specs (integers) and convert to array of strings, i.e. "BRD"
    	for (let spec in jobMap) {
    	    if (jobMap.hasOwnProperty(spec)) {
    	    	jobArr.push(jobUtils.getJobAcronymFromSpec(spec));
    	    }
    	}
    	return jobArr;
    };
    
    this.getSummaryForJob = function(jobAcronym, charSummary) {
    	const jobSpec = jobUtils.getSpecFromJobAcronym(jobAcronym);
    	//const encounterName = encounterUtils.getEncounterNameFromId(id);
    	const rankings = [];
    	for (let i = 0; i < charSummary.length; i++) {
    		if (charSummary[i].spec == jobSpec) {
    			const rankingObj = {
    					'encounter': encounterUtils.getEncounterNameFromId(charSummary[i].encounter),
    					'total': charSummary[i].total,
    					'startTime': charSummary[i].startTime,
    					'percentileMinusOne': encounterUtils.getPercentile(charSummary[i].rank, charSummary[i].outOf),
    					'displayPercentile': encounterUtils.getPercentile(charSummary[i].rank, charSummary[i].outOf)
    			};
    			rankings.push(rankingObj);
    		}
    	}
    	return rankings;
    };
});