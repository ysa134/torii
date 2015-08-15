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

    torii = container.lookup("service:torii");
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

test("Opens a popup to Stripe with the scope parameter", function(){
  expect(1);
  configuration.providers['stripe-connect'].scope = "read_only";
  mockPopup.open = function(url){
    ok(
      url.indexOf("scope=read_only") > -1,
      "scope is set from config" );
    return Ember.RSVP.resolve({ code: 'test' });
  }
  Ember.run(function(){
    torii.open('stripe-connect');
  });
});

test("Opens a popup to Stripe with the stripe_landing parameter", function(){
  expect(1);
  configuration.providers['stripe-connect'].stripeLanding = "login";
  mockPopup.open = function(url){
    ok(
      url.indexOf("stripe_landing=login") > -1,
      "stripe_landing is set from config" );
    return Ember.RSVP.resolve({ code: 'test' });
  }
  Ember.run(function(){
    torii.open('stripe-connect');
  });
});

test("Opens a popup to Stripe with the always_prompt parameter", function(){
  expect(1);
  configuration.providers['stripe-connect'].alwaysPrompt = 'true';
  mockPopup.open = function(url){
    ok(
      url.indexOf("always_prompt=true") > -1,
      "always_prompt is set from config" );
    return Ember.RSVP.resolve({ code: 'test' });
  }
  Ember.run(function(){
    torii.open('stripe-connect');
  });
});
