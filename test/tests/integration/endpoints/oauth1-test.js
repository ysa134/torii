import toriiContainer from 'test/helpers/torii-container';
import OAuth1Endpoint from 'torii/endpoints/oauth1';
import configuration from 'torii/configuration';

var torii, container;

var opened, openedUrl, mockPopup = {
  open: function(url){
    openedUrl = url;
    opened = true;
    return Ember.RSVP.resolve({});
  }
};

var requestTokenUri = 'http://localhost:3000/oauth/callback';
var endpointName = 'oauth1';
var originalConfiguration = configuration.endpoints[endpointName];

module('Oauth1 - Integration', {
  setup: function(){
    container = toriiContainer();
    container.register('torii-service:mock-popup', mockPopup, {instantiate: false});
    container.injection('torii-endpoint', 'popup', 'torii-service:mock-popup');

    container.register('torii-endpoint:'+endpointName, OAuth1Endpoint);

    torii = container.lookup("torii:main");
    configuration.endpoints[endpointName] = {requestTokenUri: requestTokenUri};
  },
  teardown: function(){
    opened = false;
    configuration.endpoints[endpointName] = originalConfiguration;
    Ember.run(container, 'destroy');
  }
});

test("Opens a popup to the requestTokenUri", function(){
  Ember.run(function(){
    torii.open(endpointName).finally(function(){
      equal(openedUrl, requestTokenUri, 'opens with requestTokenUri');
      ok(opened, "Popup service is opened");
    });
  });
});
