"use strict";

module.exports = function(grunt) {
	/**
	 * We build a set of files, each consisting of the moment-timezone library and
	 * two years worth of TZ data. This allows us to send down the minimum TZ data
	 * required for a given page. We do pairs instead of individual years so that
	 * a flight happening on New Year's Eve can still work correctly.
	 */
	
	// Build using data from 2004 to four years in the future
	var range = [2004, new Date().getFullYear() + 4];
	
	// Defines the build for unminified src JS
	var buildObj = {};
	// Defines the minification task (via uglify)
	var fileObj = {};
	
	// Make the config objects
	for (var start = range[0]; start < range[1]; start++) {
		var end = start + 1;
		var thisRange = [start, end];
		var thisName = thisRange.join('-');
		var filename = 'builds/' + thisName + '.js';
		var minFilename = 'builds/' + thisName + '.min.js';
		
		buildObj[thisName] = thisRange;
		fileObj[minFilename] = filename;
	}
	
	grunt.initConfig({
		nodeunit : {
			zones : [
				"tests/zones/**/*.js"
			],
			core : [
				"tests/moment-timezone/*.js"
			]
		},

		build : buildObj,

		uglify : {
			all: {
				files: fileObj
			},
			options: {
				report : 'gzip',
				preserveComments : 'some'
			}
		},

		jshint: {
			all: 'moment-timezone.js'
		},

		clean: {
			data: ['temp'],
			unmin: ['builds/*', '!builds/*.min.js']
		}
	});

	grunt.loadTasks("tasks");

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('release', ['jshint', 'data', 'nodeunit', 'build', 'uglify', 'clean']);

	grunt.registerTask('default', ['jshint', 'nodeunit']);
};
