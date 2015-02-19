var torii, container;

import toriiContainer from 'test/helpers/torii-container';
import configuration from 'torii/configuration';

var originalConfiguration = configuration.providers['azuread-oauth2'];

var opened, mockPopup = {
  open: function(){
    opened = true;
    return Ember.RSVP.resolve({ 'code': 'test' });
  }
};

module('AzureAd - Integration', {
  setup: function(){
    container = toriiContainer();
    container.register('torii-service:mock-popup', mockPopup, {instantiate: false});
    container.injection('torii-provider', 'popup', 'torii-service:mock-popup');

    torii = container.lookup("torii:main");
    configuration.providers['azuread-oauth2'] = { apiKey: 'dummy' };
  },
  teardown: function(){
    opened = false;
    configuration.providers['azuread-oauth2'] = originalConfiguration;
    Ember.run(container, 'destroy');
  }
});

test("Opens a popup to AzureAd", function(){
  Ember.run(function(){
    torii.open('azuread-oauth2').finally(function(){
      ok(opened, "Popup service is opened");
    });
  });
});
