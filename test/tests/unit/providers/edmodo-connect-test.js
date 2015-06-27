var provider;

import configuration from 'torii/configuration';

import EdmodoConnectProvider from 'torii/providers/edmodo-connect';

module('Unit - EdmodoConnectProvider', {
  setup: function(){
    configuration.providers['edmodo-connect'] = {};
    provider = new EdmodoConnectProvider();
  },
  teardown: function(){
    Ember.run(provider, 'destroy');
    configuration.providers['edmodo-connect'] = {};
  }
});

test("Provider requires an apiKey", function(){
  configuration.providers['edmodo-connect'] = {};
  throws(function(){
    provider.buildUrl();
  }, /Expected configuration value providers.edmodo-connect.apiKey to be defined!/);
});

test("Provider requires a redirectUri", function(){
  configuration.providers['edmodo-connect'] = {
    apiKey: 'abcdef'
  };
  throws(function(){
    provider.buildUrl();
  }, /Expected configuration value providers.edmodo-connect.redirectUri to be defined!/);
});

test("baseUrl is 'https://api.edmodo.com/oauth/authorize'", function() {
  equal(provider.get('baseUrl'), 'https://api.edmodo.com/oauth/authorize');
});

test("Provider generates a URL with required config", function(){
  configuration.providers['edmodo-connect'] = {
    apiKey: 'abcdef',
    redirectUri: 'http://localhost:4200/edmodo/callback'
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=token' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent('http://localhost:4200/edmodo/callback') +
          '&scope=basic';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});
