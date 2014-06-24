'use strict';

var path = require('path');
var fs   = require('fs');

function EmberToriiAddon(project) {
  this.project = project;
  this.name    = 'Torii';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberToriiAddon.prototype.treeFor = function treeFor(name) {

  // include app-addon (this has the initializers so that loadInitializers
  // will automatically include them)
  // We must include the initializers as part of the app tree so that
  // the es6 import statements work,
  // and we must also be sure to make those things importable by
  // explicitly declaring them when we do app.import in `included`

  // vendor-addon has the built version of torii as a named amd module,
  // in the directory 'torii', so that it is properly namespaced for our
  // app.import call in `included`

  // There are no styles for torii, so when treeFor is called with 'styles',
  // this is a no-op

  var treePath = path.join('node_modules', 'torii', name + '-addon');

  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberToriiAddon.prototype.included = function included(app) {
  app.import('vendor/torii/torii.amd.js', {
    'torii/torii': ['default'],

    // These are all exports that the torii initializers must import
    'torii/session': ['default'],
    'torii/bootstrap': ['default'],
    'torii/configuration': ['default'],
    'torii/redirect-handler': ['default']
  });

};

module.exports = EmberToriiAddon;
