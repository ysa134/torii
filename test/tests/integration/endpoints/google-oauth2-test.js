var torii, container;

import toriiContainer from 'test/helpers/torii-container';
import configuration from 'torii/configuration';

var originalConfiguration = configuration.endpoints['google-oauth2'];

var opened, mockPopup = {
  open: function(){
    opened = true;
    return Ember.RSVP.resolve({});
  }
};

module('Google - Integration', {
  setup: function(){
    container = toriiContainer();
    container.register('torii-service:mock-popup', mockPopup, {instantiate: false});
    container.injection('torii-endpoint', 'popup', 'torii-service:mock-popup');

    torii = container.lookup("torii:main");
    configuration.endpoints['google-oauth2'] = {apiKey: 'dummy'};
  },
  teardown: function(){
    opened = false;
    configuration.endpoints['google-oauth2'] = originalConfiguration;
    Ember.run(container, 'destroy');
  }
});

test("Opens a popup to Google", function(){
  Ember.run(function(){
    torii.open('google-oauth2').finally(function(){
      ok(opened, "Popup service is opened");
    });
  });
});
