angular.module('viewerApp').service('fflogsUtils', function(jobUtils) {
    console.log('loaded fflogsUtils');
    this.getJobArr = function(charSummary) {
    	console.log('called fflogsUtils.getJobArr with summary object:');
    	console.log(charSummary);
    	const jobMap = {};
    	const jobArr = [];
    	charSummary.forEach(function(encounterSummary) {
    		jobMap[encounterSummary.spec] = 1;
    	});
    	console.log('job map and arr is: ');
    	console.log(jobMap);
    	// take map of specs (integers) and convert to array of strings, i.e. "BRD"
    	for (let spec in jobMap) {
    	    if (jobMap.hasOwnProperty(spec)) {
    	    	jobArr.push(jobUtils.getJobAcronymFromSpec(spec));
    	    }
    	}
    	console.log(jobArr);
    	return jobArr;
    };
});