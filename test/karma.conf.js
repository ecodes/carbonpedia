module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
		'lib/ionic/js/angular/angular.js',
		'lib/ionic/js/angular-ui/angular-ui-router.js',
		'lib/ionic/js/angular/angular-mocks.js',
		'js/**/*.js',
		'test/unit/**/*.js',
		'lib/google_charts/jsapi.js',
		'lib/leaflet/leaflet.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
