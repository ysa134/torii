var torii, container;

import toriiContainer from 'test/helpers/torii-container';
import configuration from 'torii/configuration';

var originalConfiguration = configuration.providers['stripe-connect'];

var opened, mockPopup = {
  open: function(){
    opened = true;
    return Ember.RSVP.resolve({ code: 'test' });
  }
};

module('Stripe Connect - Integration', {
  setup: function(){
    container = toriiContainer();
    container.register('torii-service:mock-popup', mockPopup, {instantiate: false});
    container.injection('torii-provider', 'popup', 'torii-service:mock-popup');

    torii = container.lookup("torii:main");
    configuration.providers['stripe-connect'] = {apiKey: 'dummy'};
  },
  teardown: function(){
    opened = false;
    configuration.providers['stripe-connect'] = originalConfiguration;
    Ember.run(container, 'destroy');
  }
});

test("Opens a popup to Stripe", function(){
  Ember.run(function(){
    torii.open('stripe-connect').finally(function(){
      ok(opened, "Popup service is opened");
    });
  });
});
