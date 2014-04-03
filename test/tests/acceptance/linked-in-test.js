var torii, app, session, container;

import 'torii/ember'; // side effect: registers 'torii:main'
import startApp from 'test/helpers/start-app';

import configuration from 'torii/configuration';

var originalConfiguration = configuration.endpoints.linkedInOauth2;

module('Linked In - Acceptance', {
  setup: function(){
    app = startApp();
    container = app.__container__;
    torii = container.lookup("torii:main");
    session = container.lookup("torii:session");
    configuration.endpoints.linkedInOauth2 = {apiKey: 'dummy'};
  },
  teardown: function(){
    configuration.endpoints.linkedInOauth2 = originalConfiguration;
    Ember.run(app, 'destroy');
  }
});

test("Has Torii in container", function(){
  ok(torii, 'gets torii:main from the container');
});

test("Opens a popup to Linked In", function(){

  var opened = false;
  var mockPopup = {
    open: function(){
      opened = true;
      return Ember.RSVP.resolve({});
    }
  };
  container.register('torii-service:mock-popup', mockPopup, {instantiate: false});
  container.injection('torii-endpoint', 'popup', 'torii-service:mock-popup');

  Ember.run(function(){
    torii.open('linked-in-oauth2').finally(function(){
      ok(opened, "Popup service is opened");
    });
  });
});

/* Session still lacks definition
 *
test("Opens a popup to Linked In", function(){
  session.open("linked-in-oauth2");
  equal(session.isOpening, true);
});
*/
