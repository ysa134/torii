var torii, container;

import toriiContainer from 'test/helpers/torii-container';
import configuration from 'torii/configuration';

var originalConfiguration = configuration.providers['edmodo-connect'];

var opened, mockPopup;

module('Edmodo Connect - Integration', {
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
    configuration.providers['edmodo-connect'] = {
      apiKey: 'dummy',
      redirectUri: 'some url'
    };
  },
  teardown: function(){
    opened = false;
    configuration.providers['edmodo-connect'] = originalConfiguration;
    Ember.run(container, 'destroy');
  }
});

test("Opens a popup to Edmodo", function(){
  expect(1);
  Ember.run(function(){
    torii.open('edmodo-connect').finally(function(){
      ok(opened, "Popup service is opened");
    });
  });
});
