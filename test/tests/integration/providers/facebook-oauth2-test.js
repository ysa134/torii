var torii, container;

import toriiContainer from 'test/helpers/torii-container';
import configuration from 'torii/configuration';
import MockPopup from 'test/helpers/mock-popup';

var originalConfiguration = configuration.providers['facebook-oauth2'];

var mockPopup = new MockPopup();

var failPopup = new MockPopup({ state: 'invalid-state' });


module('Facebook OAuth2 - Integration', {
  setup: function(){
    container = toriiContainer();
    container.register('torii-service:mock-popup', mockPopup, {instantiate: false});
    container.register('torii-service:fail-popup', failPopup, {instantiate: false});
    container.injection('torii-provider', 'popup', 'torii-service:mock-popup');

    torii = container.lookup("service:torii");
    configuration.providers['facebook-oauth2'] = {apiKey: 'dummy'};
  },
  teardown: function(){
    mockPopup.opened = false;
    configuration.providers['facebook-oauth2'] = originalConfiguration;
    Ember.run(container, 'destroy');
  }
});

test("Opens a popup to Facebook", function(){
  Ember.run(function(){
    torii.open('facebook-oauth2').finally(function(){
      ok(mockPopup.opened, "Popup service is opened");
    });
  });
});

test("Resolves with an authentication object containing 'redirectUri'", function(){
  Ember.run(function(){
    torii.open('facebook-oauth2').then(function(data){
      ok(data.redirectUri,
         'Object has redirectUri');
    }, function(err){
      ok(false, 'Failed with err '+err);
    });
  });
});

test('Validates the state parameter in the response', function(){
  container.injection('torii-provider', 'popup', 'torii-service:fail-popup');

  Ember.run(function(){
    torii.open('facebook-oauth2').then(null, function(e){
      ok(/has an incorrect session state/.test(e.message),
         'authentication fails due to invalid session state response');
    });
  });
});
