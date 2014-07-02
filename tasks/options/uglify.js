module.exports = {
  withVersion: {
    options: {
      mangle: true
    },
    files: {
      'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': [
        'dist/<%= pkg.name %>-<%= pkg.version %>.amd.js'
      ],
    }
  },
  noVersion: {
    options: {
      mangle: true
    },
    files: {
      'dist/<%= pkg.name %>.min.js': [
        'dist/<%= pkg.name %>.amd.js'
      ],
    }
  }
};
