var provider;

import configuration from 'torii/configuration';

import AzureAdProvider from 'torii/providers/azure-ad-oauth2';

module('Unit - AzureAdOAuth2Provider', {
  setup: function(){
    configuration.providers['azure-ad-oauth2'] = {};
    provider = new AzureAdProvider();
  },
  teardown: function(){
    Ember.run(provider, 'destroy');
    configuration.providers['azure-ad-oauth2']  = {};
  }
});

test("Provider requires an apiKey", function(){
  configuration.providers['azure-ad-oauth2'] = {};
  throws(function(){
    provider.buildUrl();
  }, /Expected configuration value providers.azure-ad-oauth2.apiKey to be defined!/);
});

test("Provider generates a URL with required config", function(){
  configuration.providers['azure-ad-oauth2'] = {
    clientId: 'abcdef'
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=code' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent(provider.get('redirectUri')) +
          '&state=STATE' +
          '&api-version=1.0';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});

test("Provider generates a URL with required config including the tennantId", function(){
  configuration.providers['azure-ad-oauth2'] = {
    clientId: 'abcdef',
    tennantId: 'very-long-guid'
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=code' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent(provider.get('redirectUri')) +
          '&state=STATE' +
          '&api-version=1.0';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');

  ok(provider.get('baseUrl').indexOf('very-long-guid') !== -1)
});


test("Provider generates a URL with required config when using id_token", function(){
  configuration.providers['azure-ad-oauth2'] = {
    clientId: 'abcdef',
    responseType: 'id_token',
    responseMode: 'query',
    scope: 'openid email',
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=id_token' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent(provider.get('redirectUri')) +
          '&state=STATE' +
          '&api-version=1.0' +
          '&scope=openid%20email' +
          '&response_mode=query';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});
