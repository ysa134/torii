var torii, container;

import toriiContainer from 'test/helpers/torii-container';
import configuration from 'torii/configuration';

var originalConfiguration = configuration.providers['google-oauth2-bearer'];

var opened, mockPopup;

module('Google Bearer- Integration', {
  setup: function(){
    mockPopup = {
      open: function(){
        opened = true;
        return Ember.RSVP.resolve({ access_token: 'test' });
      }
    };
    container = toriiContainer();
    container.register('torii-service:mock-popup', mockPopup, {instantiate: false});
    container.injection('torii-provider', 'popup', 'torii-service:mock-popup');

    torii = container.lookup("service:torii");
    configuration.providers['google-oauth2-bearer'] = {apiKey: 'dummy'};
  },
  teardown: function(){
    opened = false;
    configuration.providers['google-oauth2-bearer'] = originalConfiguration;
    Ember.run(container, 'destroy');
  }
});

test("Opens a popup to Google", function(){
  expect(1);
  Ember.run(function(){
    torii.open('google-oauth2-bearer').finally(function(){
      ok(opened, "Popup service is opened");
    });
  });
});

test("Opens a popup to Google with request_visible_actions", function(){
  expect(1);
  configuration.providers['google-oauth2-bearer'].requestVisibleActions = "http://some-url.com";
  mockPopup.open = function(url){
    ok(
      url.indexOf("request_visible_actions=http%3A%2F%2Fsome-url.com") > -1,
      "request_visible_actions is present" );
    return Ember.RSVP.resolve({ access_token: 'test' });
  }
  Ember.run(function(){
    torii.open('google-oauth2-bearer');
  });
});
