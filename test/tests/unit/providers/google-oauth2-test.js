var provider;

import configuration from 'torii/configuration';

import GoogleProvider from 'torii/providers/google-oauth2';

module('Unit - GoogleAuth2Provider', {
  setup: function(){
    configuration.providers['google-oauth2'] = {};
    provider = new GoogleProvider();
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
          '&state=STATE' +
          '&scope=email' +
          '&approval_prompt=force';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});
