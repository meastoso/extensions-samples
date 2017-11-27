angular.module('viewerApp').service('fflogsUtils', function(jobUtils, encounterUtils) {
    this.getJobArr = function(charSummary) {
    	const jobMap = {};
    	const jobArr = [];
    	charSummary.forEach(function(encounterSummary) {
    		encounterSummary.specs.forEach(function(specSummaryForEncounter) {
    			jobMap[specSummaryForEncounter.spec] = 1;
    		});
    	});
    	// take map of specs (Full Names, "Bard") and convert to array of acronym strings, i.e. "BRD"
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
    		const encounterSummary = charSummary[i];
	    	const specsArr = encounterSummary.specs;
    		for (let i = 0; i < specsArr.length; i++) {
    			if (specsArr[i].spec == jobSpec) {
    				const rankingObj = {
        					'encounter': encounterSummary.name,
        					'total': specsArr[i].best_persecondamount,
        					/*'startTime': charSummary[i].startTime,*/
        					'percentileMinusOne': encounterUtils.getPercentile(specsArr[i].best_historical_percent),
        					'displayPercentile': encounterUtils.getPercentile(specsArr[i].best_historical_percent)
        			};
        			rankings.push(rankingObj);
    			}
    		}
    	}
    	return rankings;
    };
});