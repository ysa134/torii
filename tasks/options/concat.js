module.exports = {
  amd: {
    src: [
      'tmp/**/*.amd.js'
    ],
    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.amd.js'
  },

  amdNoVersion: {
    src: [
      'tmp/**/*.amd.js',
    ],
    dest: 'dist/<%= pkg.name %>.amd.js'
  },

  forTests: {
    src: [
      'vendor/loader.js',
      'tmp/<%= pkg.name %>/**/*.amd.js',
      'tmp/<%= pkg.name %>.amd.js'
    ],
    dest: 'tmp/<%= pkg.name %>.testbuild.js'
  },

  amdTests: {
    src: [
      'tmp/tests/amd/**/*.js'
    ],
    dest: 'tmp/tests.amd.js',
  }

};
