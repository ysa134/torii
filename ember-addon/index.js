'use strict';

module.exports = {
  name: 'torii',
  init: function() {
    this.treePaths.app = '../lib/torii';
    this.treePaths.addon = '../lib/torii';
  },

  treeForApp: function treeForApp(tree) {
    var Funnel = require('broccoli-funnel');

    return new Funnel(tree, {
      srcDir: 'initializers',
      destDir: 'initializers'
    });
  },

  treeForAddon: function treeForAddon() {
    var tree = this._super.treeForAddon.apply(this, arguments);

    this.replace = this.replace || require('broccoli-string-replace');

    // Use a build-time check to output a warning if Torii is not
    // configured.
    var config = this.project.config(process.env.EMBER_ENV);
    if (!config.torii) {
      console.warn("Torii is installed but not configured in config/environment.js!");
    } else {
      var projectPrefix = this.project.name();
      if (this.project.isEmberCLIAddon()) {
        projectPrefix = config.modulePrefix;
      }
      // Use run-time lookup of the ENV via require. This is better than
      // build-time configuration since this code will not be run again if
      // config/environment changes.
      tree = this.replace(tree, {
        files: ['modules/torii/configuration.js'],
        patterns: [{
          match: /get\(window, 'ENV\.torii'\)/,
          replacement: 'require("'+projectPrefix+'/config/environment")["default"].torii'
        }]
      });
    }

    return tree;
  }
};
