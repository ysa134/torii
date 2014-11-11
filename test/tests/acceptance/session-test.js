import startApp from 'test/helpers/start-app';
import DummyAdapter from 'test/helpers/dummy-adapter';
import DummySuccessProvider from 'test/helpers/dummy-success-provider';
import DummyFailureProvider from 'test/helpers/dummy-failure-provider';

var torii, app, session, container, adapter;

function signIn(sessionData){
  var sm = session.get('stateMachine');
  sm.send('startOpen');
  sm.send('finishOpen', sessionData || {});
}

module('Session - Acceptance', {
  setup: function(){
    app = startApp({loadInitializers: true});
    container = app.__container__;
    torii   = container.lookup("torii:main");
    session = container.lookup("torii:session");
    adapter = container.lookup("torii-adapter:application");

    container.register('torii-provider:dummy-failure', DummyFailureProvider);
    container.register('torii-provider:dummy-success', DummySuccessProvider);
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

test("#fetch session passes options to adapter", function(){
  var adapterFetchCalledWith = null;
  container.register("torii-adapter:dummy-success", DummyAdapter.extend({
    fetch: function(options){
      adapterFetchCalledWith = options;
      return this._super(options);
    }
  }));
  Ember.run(function(){
    var opts = {};
    session.fetch('dummy-success', opts).then(function(){
      equal(adapterFetchCalledWith, opts, 'options should be passed through to adapter');
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
    session.close('dummy-success').then(function(){
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
    session.close('dummy-success').then(function(){
      ok(false, 'resolved promise');
    }, function(error){
      ok(true, 'fails promise');
      ok(error.message.match(/must implement/), 'fails with message to implement');
    });
  });
});

test("#close dummy-success session passes options to adapter", function(){
  signIn({currentUser: {email: 'some@email.com'}});
  var optionsCloseCalledWith = null;
  container.register("torii-adapter:dummy-success", DummyAdapter.extend({
    close: function(options){
      optionsCloseCalledWith = options;
      return this._super(options);
    }
  }));
  Ember.run(function(){
    var opts = {};
    session.close('dummy-success', opts).then(function(){
      equal(optionsCloseCalledWith, opts, 'options should be passed through to adapter');
    }, function(err){
      ok(false, 'failed to resolve promise: '+err);
    });
  });
});

test("#close dummy-success session uses named adapter when present", function(){
  signIn({currentUser: {email: 'some@email.com'}});
  var correctAdapterCalled = false;
  container.register("torii-adapter:dummy-success", DummyAdapter.extend({
    close: function() {
      correctAdapterCalled = true;
      return this._super();
    }
  }));
  Ember.run(function(){
    session.close('dummy-success').then(function(){
      ok(correctAdapterCalled, 'named adapter should be used');
    }, function(err){
      ok(false, 'failed to resolve promise: '+err);
    });
  });
});
