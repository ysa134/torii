// If the user does not have a module system, how are
// we doing this?
var configuration = require('torii/configuration').default;

configuration.endpoints.linkedInOauth2 = {
  apiKey: '772yus6d70pf11'
};

require("torii/ember");

var App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
  actions: {
    authenticate: function(endpoint){
      var controller = this.controller;
      controller.set('error', null);
      controller.set('authData', null);
      this.get('torii').open(endpoint).then(function(authData){
        controller.set('authData', authData);
      }, function(error){
        controller.set('error', error);
      });
    }
  }
});
