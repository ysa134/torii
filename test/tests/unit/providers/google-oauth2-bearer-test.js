var provider;

import configuration from 'torii/configuration';

import GoogleBearerProvider from 'torii/providers/google-oauth2-bearer';

module('Unit - GoogleAuth2BearerProvider', {
  setup: function(){
    configuration.providers['google-oauth2-bearer'] = {};
    provider = GoogleBearerProvider.create();
  },
  teardown: function(){
    Ember.run(provider, 'destroy');
    configuration.providers['google-oauth2-bearer'] = {};
  }
});

test("Provider requires an apiKey", function(){
  configuration.providers['google-oauth2-bearer'] = {};
  throws(function(){
    provider.buildUrl();
  }, /Expected configuration value providers.google-oauth2-bearer.apiKey to be defined!/);
});

test("Provider generates a URL with required config", function(){
  configuration.providers['google-oauth2-bearer'] = {
    apiKey: 'abcdef'
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=token' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent(provider.get('redirectUri')) +
          '&state=' + provider.get('state') +
          '&scope=email';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});
