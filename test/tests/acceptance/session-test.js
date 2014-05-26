import 'torii/ember'; // side effect: registers 'torii:main'
import startApp from 'test/helpers/start-app';
import DummyAdapter from 'torii/adapters/dummy';

var torii, app, session, container, adapter;

function signIn(sessionData){
  var sm = session.get('stateMachine');
  sm.send('startOpen');
  sm.send('finishOpen', sessionData || {});
}

module('Session - Acceptance', {
  setup: function(){
    app = startApp();
    container = app.__container__;
    torii   = container.lookup("torii:main");
    session = container.lookup("torii:session");
    adapter = container.lookup("torii-adapter:application");
  },
  teardown: function(){
    Ember.run(app, 'destroy');
  }
});

test("#open dummy-success session raises must-implement on application adapter", function(){
  Ember.run(function(){
    session.open('dummy-success').then(function(){
      ok(false, 'resolved promise');
    }, function(error){
      ok(true, 'fails promise');
      ok(error.message.match(/must implement/), 'fails with message to implement');
    });
  });
});

test("#open dummy-success session fails on signed in state", function(){
  signIn();
  Ember.run(function(){
    session.open('dummy-success').then(function(){
      ok(false, 'resolved promise');
    }, function(error){
      ok(true, 'fails promise');
      ok(error.message.match(/Unknown Event/), 'fails with message');
    });
  });
});

test("#open dummy-success session successfully opens", function(){
  container.register("torii-adapter:dummy-success", DummyAdapter);
  Ember.run(function(){
    session.open('dummy-success').then(function(){
      ok(true, 'resolves promise');
      ok(session.get('isAuthenticated'), 'authenticated');
      ok(session.get('currentUser.email'), 'user has email');
    }, function(err){
      ok(false, 'failed to resolve promise: '+err);
    });
  });
});

test("#open dummy-failure session fails to open", function(){
  Ember.run(function(){
    session.open('dummy-failure').then(function(){
      ok(false, 'should not resolve promise');
    }, function(error){
      ok(true, 'fails to resolve promise');
    });
  });
});

test("#fetch dummy-success session raises must-implement on application adapter", function(){
  Ember.run(function(){
    session.fetch('dummy-success').then(function(){
      ok(false, 'resolved promise');
    }, function(error){
      ok(true, 'fails promise');
      ok(error.message.match(/must implement/), 'fails with message to implement');
    });
  });
});

test("#fetch dummy-success session fails on signed in state", function(){
  container.register("torii-adapter:dummy-success", DummyAdapter);
  signIn();
  Ember.run(function(){
    session.fetch('dummy-success').then(function(){
      ok(false, 'resolved promise');
    }, function(error){
      ok(true, 'fails promise');
      ok(error.message.match(/Unknown Event/), 'fails with message');
    });
  });
});

test("#fetch dummy-success session successfully opens", function(){
  container.register("torii-adapter:dummy-success", DummyAdapter);
  Ember.run(function(){
    session.fetch('dummy-success').then(function(){
      ok(true, 'resolves promise');
      ok(session.get('isAuthenticated'), 'authenticated');
      ok(session.get('currentUser.email'), 'user has email');
    }, function(err){
      ok(false, 'failed to resolve promise: '+err);
    });
  });
});

test("#fetch dummy-failure session fails to open", function(){
  Ember.run(function(){
    session.open('dummy-failure').then(function(){
      ok(false, 'should not resolve promise');
    }, function(error){
      ok(true, 'fails to resolve promise');
    });
  });
});

test("#close dummy-success fails in an unauthenticated state", function(){
  adapter.reopen({
    close: function(){
      return Ember.RSVP.Promise.resolve();
    }
  });
  Ember.run(function(){
    session.close().then(function(){
      ok(false, 'resolved promise');
    }, function(error){
      ok(true, 'fails promise');
      ok(error.message.match(/Unknown Event/), 'fails with message');
    });
  });
});

test("#close dummy-success session closes", function(){
  signIn({currentUser: {email: 'some@email.com'}});
  adapter.reopen({
    close: function(){
      return Ember.RSVP.Promise.resolve();
    }
  });
  Ember.run(function(){
    session.close().then(function(){
      ok(true, 'resolved promise');
      ok(!session.get('isAuthenticated'), 'authenticated');
      ok(!session.get('currentUser.email'), 'user has email');
    }, function(error){
      ok(false, 'fails promise');
    });
  });
});

test("#close dummy-success session raises must-implement on application adapter", function(){
  signIn();
  Ember.run(function(){
    session.close().then(function(){
      ok(false, 'resolved promise');
    }, function(error){
      ok(true, 'fails promise');
      ok(error.message.match(/must implement/), 'fails with message to implement');
    });
  });
});
