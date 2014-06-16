import toriiContainer from 'test/helpers/torii-container';
import OAuth1Provider from 'torii/providers/oauth1';
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
var providerName = 'oauth1';
var originalConfiguration = configuration.providers[providerName];

module('Oauth1 - Integration', {
  setup: function(){
    container = toriiContainer();
    container.register('torii-service:mock-popup', mockPopup, {instantiate: false});
    container.injection('torii-provider', 'popup', 'torii-service:mock-popup');

    container.register('torii-provider:'+providerName, OAuth1Provider);

    torii = container.lookup("torii:main");
    configuration.providers[providerName] = {requestTokenUri: requestTokenUri};
  },
  teardown: function(){
    opened = false;
    configuration.providers[providerName] = originalConfiguration;
    Ember.run(container, 'destroy');
  }
});

test("Opens a popup to the requestTokenUri", function(){
  Ember.run(function(){
    torii.open(providerName).finally(function(){
      equal(openedUrl, requestTokenUri, 'opens with requestTokenUri');
      ok(opened, "Popup service is opened");
    });
  });
});
