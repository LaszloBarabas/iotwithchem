'use strict'

module.exports = (config) => {
	config.set({
		basePath: './',

		files: [
      // Libraries
			'node_modules/angular/angular.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'node_modules/angular-ui-router/release/angular-ui-router.js',

			// Angular app files
			'frontend/src/app.js',
			'frontend/src/app.config.js',
			'frontend/src/app.route.js',
			'frontend/src/home/home.controller.js',
			'frontend/src/users/user.service.js',

			// Tests
			'test/unit/*.js'
		],

		exclude: [],

		singleRun: true,

		port: 9999,

		colors: true,

		autoWatch: false,

		frameworks: ['jasmine'],

		browsers: ['Chrome'],

		preprocessors: {
			'frontend/**/*.js': ['babel'],
			'test/unit/**/*.js': ['babel'],
			'frontend/**/!(*.mock|*.spec).js': ['coverage']
		},

		babelPreprocessor: {
			options: {
				presets: ['latest']
			}
		},

		reporters: ['spec'],

		coverageReporter: {
			type: 'html',
			// output coverage reports
			dir: 'test/coverage/'
		},

		plugins: [
			'karma-phantomjs2-launcher',
			'karma-chrome-launcher',
			'karma-jasmine',
			'karma-coverage',
			'karma-babel-preprocessor',
			'karma-spec-reporter'
		],
	})
}
