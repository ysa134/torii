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
  if (name !== 'vendor') { return; }
  var treePath =  path.join('node_modules', 'torii', 'vendor');

  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberToriiAddon.prototype.included = function included(app) {
  this.app = app;

  if (!this.toriiIncluded) {
    this.app.import('vendor/torii/dist/torii.amd.js');
    this.toriiIncluded = true;
  }

};

module.exports = EmberToriiAddon;
