module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'bower_components/underscore/underscore.js',
      'bower_components/chai/chai.js',
      'bower_components/sinon/index.js',
      'bower_components/sinon-chai/lib/sinon-chai.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/**/*.js'
    ],
    exclude: [ ],
    preprocessors: { },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
