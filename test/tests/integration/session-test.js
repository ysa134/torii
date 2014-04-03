var container, session;

import toriiContainer from 'test/helpers/torii-container';
import Session from 'torii/session';

module('Session - Integration', {
  setup: function(){
    container = toriiContainer();
    container.register('torii:session', Session);
    session = container.lookup('torii:session');
  },
  teardown: function(){
    Ember.run(container, 'destroy');
  }
});

test("session starts in unauthenticated unopened state", function(){
  ok(!session.get('isOpening'), 'not opening');
  ok(!session.get('isAuthenticated'), 'not authenticated');
});

test("starting auth sets isOpening to true", function(){
  var endpoint = container.lookup('torii-endpoint:dummy-success');
  var oldOpen = endpoint.open;

  endpoint.open = function(){
    ok(true, 'calls endpoint.open');
    ok(session.get('isOpening'), 'session.isOpening is true');

    return oldOpen.apply(this, arguments);
  };

  Ember.run(function(){
    session.open('dummy-success');
  });
});

test("successful auth sets isAuthenticated to true", function(){
  Ember.run(function(){
    session.open('dummy-success').then(function(){
      ok(!session.get('isOpening'), 'session is no longer opening');
      ok(session.get('isAuthenticated'), 'session is authenticated');
    });
  });
});

test("failed auth sets isAuthenticated to false, sets error", function(){
  Ember.run(function(){
    session.open('dummy-failure').then(function(){
      ok(false, 'should not resolve promise');
    }, function(err){
      ok(true, 'resolves promise');

      ok(!session.get('isOpening'), 'session is no longer opening');
      ok(!session.get('isAuthenticated'), 'session is not authenticated');
      ok(session.get('error'), 'session has error');
      ok(session.get('errorMessage'), 'session has error message');
    });
  });
});
