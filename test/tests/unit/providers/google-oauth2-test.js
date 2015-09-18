var provider;

import configuration from 'torii/configuration';

import GoogleProvider from 'torii/providers/google-oauth2';

module('Unit - GoogleAuth2Provider', {
  setup: function(){
    configuration.providers['google-oauth2'] = {};
    provider = GoogleProvider.create();
  },
  teardown: function(){
    Ember.run(provider, 'destroy');
    configuration.providers['google-oauth2'] = {};
  }
});

test("Provider requires an apiKey", function(){
  configuration.providers['google-oauth2'] = {};
  throws(function(){
    provider.buildUrl();
  }, /Expected configuration value providers.google-oauth2.apiKey to be defined!/);
});

test("Provider generates a URL with required config", function(){
  configuration.providers['google-oauth2'] = {
    apiKey: 'abcdef',
    approvalPrompt: 'force'
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=code' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent(provider.get('redirectUri')) +
          '&state=' + provider.get('state') +
          '&scope=email' +
          '&approval_prompt=force';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});

test("Provider generates a URL with optional parameters", function(){
  configuration.providers['google-oauth2'] = {
    apiKey: 'abcdef',
    approvalPrompt: 'force',
    requestVisibleActions: 'http://some-url.com',
    accessType: 'offline',
    hd: 'google.com'
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=code' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent(provider.get('redirectUri')) +
          '&state=' + provider.get('state') +
          '&scope=email' +
          '&request_visible_actions=' + encodeURIComponent('http://some-url.com') +
          '&access_type=offline' +
          '&approval_prompt=force' +
          '&hd=google.com';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});
