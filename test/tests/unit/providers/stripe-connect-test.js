var provider;

import configuration from 'torii/configuration';

import StripeConnectProvider from 'torii/providers/stripe-connect';

module('Unit - StripeConnectProvider', {
  setup: function(){
    configuration.providers['stripe-connect'] = {};
    provider = StripeConnectProvider.create();
  },
  teardown: function(){
    Ember.run(provider, 'destroy');
    configuration.providers['stripe-connect'] = {};
  }
});

test("Provider requires an apiKey", function(){
  configuration.providers['stripe-connect'] = {};
  throws(function(){
    provider.buildUrl();
  }, /Expected configuration value providers.stripe-connect.apiKey to be defined!/);
});

test("Provider generates a URL with required config", function(){
  configuration.providers['stripe-connect'] = {
    apiKey: 'abcdef',
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=code' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent(provider.get('redirectUri')) +
          '&state=' + provider.get('state') +
          '&scope=read_write' +
          '&always_prompt=false';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});

test("Provider generates a URL with optional parameters", function(){
  configuration.providers['stripe-connect'] = {
    apiKey: 'abcdef',
    scope: 'read_only',
    stripeLanding: 'login',
    alwaysPrompt: true
  };

  var expectedUrl = provider.get('baseUrl') + '?' + 'response_type=code' +
          '&client_id=' + 'abcdef' +
          '&redirect_uri=' + encodeURIComponent(provider.get('redirectUri')) +
          '&state=' + provider.get('state') +
          '&scope=read_only' +
          '&stripe_landing=login' +
          '&always_prompt=true';

  equal(provider.buildUrl(),
        expectedUrl,
        'generates the correct URL');
});
