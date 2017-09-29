angular.module('viewerApp').service('encounterUtils', function() {
    const encounterMap = {
    		42: "Alte Roite",
    		43: "Catastrophe",
    		44: "Halicarnassus",
    		45: "Exdeath",
    		46: "Neo Exdeath"
    };
	
    this.getEncounterNameFromId = function(id) {
    	return encounterMap[id];
    }
    
    this.getPercentile = function(rank, outOf) {
    	const percentage = (rank / outOf) * 100;
    	const percentile = Math.round(100 - percentage) - 1; // 98% is GOOD (i.e. low rank)
    	// NOTE: OFFSET BY -1 AND ADD IT WHEN THE VIEW IS SHOWN SO ANIMATION IS TRIGGERED ON GAUGES!
    	return percentile;
    }
});