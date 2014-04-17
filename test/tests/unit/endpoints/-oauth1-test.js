var endpoint;

import configuration from 'torii/configuration';

var originalConfiguration = configuration.endpoints['mock-oauth1'];

import BaseEndpoint from 'torii/endpoints/-oauth1';

var endpointName = 'mock-oauth1';

var Endpoint = BaseEndpoint.extend({
  name: endpointName,
  baseUrl: 'http://example.com',
  redirectUri: 'http://foo'
});

module('MockOauth1Endpoint (-oauth1 subclass) - Unit', {
  setup: function(){
    configuration.endpoints['mock-oauth1'] = {};
    endpoint = new Endpoint();
  },
  teardown: function(){
    Ember.run(endpoint, 'destroy');
    configuration.endpoints[endpointName] = originalConfiguration;
  }
});

test("Endpoint requires a requestTokenUri", function(){
  configuration.endpoints[endpointName] = {};
  throws(function(){
    endpoint.buildRequestTokenUrl();
  }, /Expected configuration value endpoints.mock-oauth1.requestTokenUri to be defined!/);
});

test("buildRequestTokenUrl generates a URL with required config", function(){
  configuration.endpoints[endpointName] = {
    requestTokenUri: 'http://expectedUrl.com'
  };
  equal(endpoint.buildRequestTokenUrl(), 'http://expectedUrl.com',
        'generates the correct URL');
});
