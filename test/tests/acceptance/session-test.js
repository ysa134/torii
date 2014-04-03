var torii, app, session, container;

import 'torii/ember'; // side effect: registers 'torii:main'
import startApp from 'test/helpers/start-app';

module('Session - Acceptance', {
  setup: function(){
    app = startApp();
    container = app.__container__;
    torii = container.lookup("torii:main");
    session = container.lookup("torii:session");
  },
  teardown: function(){
    Ember.run(app, 'destroy');
  }
});

test("dummy-success session successfully opens", function(){

  Ember.run(function(){
    session.open('dummy-success').then(function(user){
      ok(true, 'resolves promise');
      ok(user.get('email'), 'user has email');
    }, function(err){
      ok(false, 'failed to resolve promise: '+err);
    });
  });
});

test("dummy-failure session fails to open", function(){

  Ember.run(function(){
    session.open('dummy-failure').then(function(user){
      ok(false, 'should not resolve promise');
    }, function(error){
      ok(true, 'fails to resolve promise');
    });
  });
});
