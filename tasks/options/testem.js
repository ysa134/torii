// See https://npmjs.org/package/grunt-contrib-testem for more config options
module.exports = {
  basic: {
    options: {
      parallel: 2,
      framework: 'qunit',
      port: (parseInt(process.env.PORT || 7358, 10) + 1),
      test_page: 'test/index.html',
      routes: {
      },
      src_files: [
        "test/index.html",
        "tmp/tests.amd.js",
        "dist/torii.amd.js"
      ],
      launch_in_dev: ['PhantomJS', 'Chrome'],
      launch_in_ci: ['PhantomJS', 'Chrome'],
    }
  },
  browsers: {
    options: {
      parallel: 8,
      framework: 'qunit',
      port: (parseInt(process.env.PORT || 7358, 10) + 1),
      test_page: 'test/index.html',
      routes: {
      },
      src_files: [
        "test/index.html",
        "tmp/tests.amd.js",
        "dist/torii.amd.js"
      ],
      launch_in_dev: ['PhantomJS',
                     'Chrome',
                     'ChromeCanary',
                     'Firefox',
                     'Safari',
                     'IE7',
                     'IE8',
                     'IE9'],
      launch_in_ci: ['PhantomJS',
                     'Chrome',
                     'ChromeCanary',
                     'Firefox',
                     'Safari',
                     'IE7',
                     'IE8',
                     'IE9'],
    }
  }
};
