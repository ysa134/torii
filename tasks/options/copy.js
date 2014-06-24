module.exports = {
  appAddOn: {
    cwd: 'lib/torii',
    src: 'initializers/*.js',
    dest: 'app-addon',
    expand: true
  },

  vendorAddOn: {
    cwd: 'dist',
    src: 'torii.amd.js',
    dest: 'vendor-addon/torii/',
    expand: true
  }
};
