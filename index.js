var fs = require('fs')



var defaultOpts = {
	file: 'jasmine-test-results.json',
	stats: 'stats.json',
	beautify: true,
	indentationLevel: 4 // used if beautify === true
};

function reporter(opts) {
	var options = shallowMerge(defaultOpts, typeof opts === 'object' ? opts : {});
	var specResults = [];
	var masterResults = Object.create(null);
	var failed = 0;
	var passed = 0;
	var skipped = 0;
	var specs = 0
	var suites = 0

	this.suiteDone = function(suite) {
		suite.specs = specResults;
		masterResults[suite.id] = suite;
		specResults = [];
		suites++;
	};

	this.specDone = function(spec) {
		specResults.push(spec);
		specs++
		if (spec.status === 'passed') passed++
		if (spec.status === 'failed') failed++
		if (spec.status === 'skipped') skipped++
	};

	this.jasmineDone = function() {
		var resultsOutput = options.beautify ?
			JSON.stringify(masterResults, null, options.indentationLevel) :
			JSON.stringify(masterResults);

		var stats = {
			passed: passed,
			failed: failed,
			skipped: skipped,
			specs: specs,
			suites: suites
		}

		var statsOutput = options.beautify ?
			JSON.stringify(stats, null, options.indentationLevel) :
			JSON.stringify(stats);

		fs.writeFileSync(options.stats, statsOutput);
		fs.writeFileSync(options.file, resultsOutput);
	};
};

function shallowMerge(obj1, obj2) {
	var mergedObj = {};

	Object.keys(obj1).forEach(function(key) {
		if (!obj2[key]) mergedObj[key] = obj1[key];
		else mergedObj[key] = obj2[key];
	});

	return mergedObj;
};

module.exports = reporter;