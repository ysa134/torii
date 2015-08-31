var provider;

import configuration from 'torii/configuration';

var originalConfiguration = configuration.providers['mock-oauth2'];

import BaseProvider from 'torii/providers/oauth2-bearer';

var Provider = BaseProvider.extend({
  name: 'mock-oauth2',
  baseUrl: 'http://example.com',
  redirectUri: 'http://foo',
  responseParams: ['state', 'access_token']
});

module('MockOauth2Provider (oauth2-bearer subclass) - Unit', {
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
  equal(provider.buildUrl(), 'http://example.com?response_type=token&client_id=dummyKey&redirect_uri=http%3A%2F%2Ffoo&state=' + provider.get('state'),
        'generates the correct URL');
});

test("Provider generates a URL with optional scope", function(){
  configuration.providers['mock-oauth2'] = {
    apiKey: 'dummyKey',
    scope: 'someScope'
  };
  equal(provider.buildUrl(), 'http://example.com?response_type=token&client_id=dummyKey&redirect_uri=http%3A%2F%2Ffoo&state=' + provider.get('state') + '&scope=someScope',
        'generates the correct URL');
});

test('Provider#open throws when any required response params are missing', function(){
  expect(3);

  configuration.providers['mock-oauth2'] = {
    apiKey: 'dummyKey',
    scope: 'someScope'
  };

  var mockPopup = {
    open: function(url, responseParams){
      ok(true, 'calls popup.open');

      return Ember.RSVP.resolve({state: 'state'});
    }
  };

  provider.set('popup', mockPopup);

  Ember.run(function(){
    provider.open().then(function(){
      ok(false, '#open should not resolve');
    }).catch(function(e){
      ok(true, 'failed');
      var message = e.toString().split('\n')[0];
      equal(message, 'Error: The response from the provider is missing these required response params: access_token');
    });
  });
});
