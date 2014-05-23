var endpoint;

import configuration from 'torii/configuration';

var originalConfiguration = configuration.endpoints['mock-oauth2'];

import BaseEndpoint from 'torii/endpoints/oauth2-code';

var Endpoint = BaseEndpoint.extend({
  name: 'mock-oauth2',
  baseUrl: 'http://example.com',
  redirectUri: 'http://foo'
});

module('MockOauth2Endpoint (oauth2-code subclass) - Unit', {
  setup: function(){
    configuration.endpoints['mock-oauth2'] = {};
    endpoint = new Endpoint();
  },
  teardown: function(){
    Ember.run(endpoint, 'destroy');
    configuration.endpoints['mock-oauth2'] = originalConfiguration;
  }
});

test("BaseEndpoint subclass must have baseUrl", function(){
  var Subclass = BaseEndpoint.extend();
  var endpoint = Subclass.create();
  throws(function(){
    endpoint.buildUrl();
  }, /Definition of property baseUrl by a subclass is required./);
});

test("Endpoint requires an apiKey", function(){
  configuration.endpoints['mock-oauth2'] = {};
  throws(function(){
    endpoint.buildUrl();
  }, /Expected configuration value endpoints.mock-oauth2.apiKey to be defined!/);
});

test("Endpoint generates a URL with required config", function(){
  configuration.endpoints['mock-oauth2'] = {
    apiKey: 'dummyKey'
  };
  equal(endpoint.buildUrl(), 'http://example.com?response_type=code&client_id=dummyKey&redirect_uri=http%3A%2F%2Ffoo',
        'generates the correct URL');
});

test("Endpoint generates a URL with optional scope", function(){
  configuration.endpoints['mock-oauth2'] = {
    apiKey: 'dummyKey',
    scope: 'someScope'
  };
  equal(endpoint.buildUrl(), 'http://example.com?response_type=code&client_id=dummyKey&redirect_uri=http%3A%2F%2Ffoo&scope=someScope',
        'generates the correct URL');
});
