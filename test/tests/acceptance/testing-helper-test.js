import startApp from 'test/helpers/start-app';
import {stubValidSession} from 'torii/helpers/testing';

var app, container, session;

module('Testing Helper - Acceptance', {
  setup: function(){
    app = startApp({loadInitializers: true});
    container = app.__container__;
  },
  teardown: function(){
    Ember.run(app, 'destroy');
  }
});


test("sessions are not authenticated by default", function(){
  session = container.lookup("torii:session");
  ok(!session.get('isAuthenticated'),"session is not authenticated");
});

test("#stubValidSession should stub a session that isAuthenticated", function(){
  stubValidSession(app, { id : 42 });
  session = container.lookup("torii:session");
  ok(session.get('isAuthenticated'),"session is authenticated");
});

test("#stubValidSession should stub a session with the userData supplied", function(){
  stubValidSession(app, { id : 42 });
  session = container.lookup("torii:session");
  equal(session.get('currentUser.id'), 42,"session contains the correct currentUser");
});
