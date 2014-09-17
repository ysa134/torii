module.exports = {
  appAddOn: {
    cwd: 'lib/torii',
    src: 'initializers/*.js',
    dest: 'dist/addon/app',
    expand: true
  },

  vendorAddOn: {
    cwd: 'dist',
    src: 'torii.amd.js',
    dest: 'dist/addon/vendor/torii/',
    expand: true
  }
};
