/* global Handlebars */

// If the user does not have a module system, how are
// we doing this?
var configuration = require('torii/configuration').default;

configuration.endpoints['linked-in-oauth2'] = {
  apiKey: '772yus6d70pf11'
};

configuration.endpoints['google-oauth2'] = {
  redirectUri: 'http://localhost:8000/example/',
  apiKey:      '139338504777-vqu8ikemg935k1kivsku7fv3cfgq9452.apps.googleusercontent.com'
};

configuration.endpoints['facebook-connect'] = {
  appId:      '744221908941738'
};

configuration.endpoints['facebook-oauth2'] = {
  apiKey:      '744221908941738',
  redirectUri: 'http://localhost.dev:8000/example/'
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

Ember.Handlebars.registerBoundHelper('inspect-object', function(obj){
  return new Handlebars.SafeString(JSON.stringify(obj));
});
