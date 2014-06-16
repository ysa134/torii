var provider;

import configuration from 'torii/configuration';

var originalConfiguration = configuration.providers['mock-oauth2'];

import BaseProvider from 'torii/providers/oauth2-code';

var Provider = BaseProvider.extend({
  name: 'mock-oauth2',
  baseUrl: 'http://example.com',
  redirectUri: 'http://foo'
});

module('MockOauth2Provider (oauth2-code subclass) - Unit', {
  setup: function(){
    configuration.providers['mock-oauth2'] = {};
    provider = new Provider();
  },
  teardown: function(){
    Ember.run(provider, 'destroy');
    configuration.providers['mock-oauth2'] = originalConfiguration;
  }
});

test("BaseProvider subclass must have baseUrl", function(){
  var Subclass = BaseProvider.extend();
  var provider = Subclass.create();
  throws(function(){
    provider.buildUrl();
  }, /Definition of property baseUrl by a subclass is required./);
});

test("Provider requires an apiKey", function(){
  configuration.providers['mock-oauth2'] = {};
  throws(function(){
    provider.buildUrl();
  }, /Expected configuration value providers.mock-oauth2.apiKey to be defined!/);
});

test("Provider generates a URL with required config", function(){
  configuration.providers['mock-oauth2'] = {
    apiKey: 'dummyKey'
  };
  equal(provider.buildUrl(), 'http://example.com?response_type=code&client_id=dummyKey&redirect_uri=http%3A%2F%2Ffoo',
        'generates the correct URL');
});

test("Provider generates a URL with optional scope", function(){
  configuration.providers['mock-oauth2'] = {
    apiKey: 'dummyKey',
    scope: 'someScope'
  };
  equal(provider.buildUrl(), 'http://example.com?response_type=code&client_id=dummyKey&redirect_uri=http%3A%2F%2Ffoo&scope=someScope',
        'generates the correct URL');
});
