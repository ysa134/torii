var container, torii;

import toriiContainer from 'test/helpers/torii-container';
import DummySuccessProvider from 'test/helpers/dummy-success-provider';
import DummyFailureProvider from 'test/helpers/dummy-failure-provider';

module('Torii - Integration', {
  setup: function(){
    container = toriiContainer();

    container.register('torii-provider:dummy-success', DummySuccessProvider);
    container.register('torii-provider:dummy-failure', DummyFailureProvider);
    torii = container.lookup('torii:main');
  },
  teardown: function(){
    Ember.run(container, 'destroy');
  }
});

test("torii opens a dummy-success provider", function(){
  Ember.run(function(){
    torii.open('dummy-success', {name: 'dummy'}).then(function(authentication){
      ok(true, 'torii resolves an open promise');
      equal(authentication.name, 'dummy', 'resolves with an authentication object');
    }, function(){
      ok(false, 'torii failed to resolve an open promise');
    });
  });
});

test("torii fails to open a dummy-failure provider", function(){
  Ember.run(function(){
    torii.open('dummy-failure').then(function(authentication){
      ok(false, 'torii resolved an open promise');
    }, function(){
      ok(true, 'torii rejected a failed open');
    });
  });
});

test("torii fetches a dummy-success provider", function(){
  container.register('torii-provider:with-fetch', DummySuccessProvider.extend({
    fetch: Ember.RSVP.Promise.resolve
  }));
  Ember.run(function(){
    torii.open('with-fetch', {name: 'dummy'}).then(function(authentication){
      ok(true, 'torii resolves a fetch promise');
    }, function(){
      ok(false, 'torii failed to resolve an fetch promise');
    });
  });
});

test("torii fails to fetch a dummy-failure provider", function(){
  container.register('torii-provider:with-fetch', DummyFailureProvider.extend({
    fetch: Ember.RSVP.Promise.reject
  }));
  Ember.run(function(){
    torii.open('with-fetch').then(function(authentication){
      ok(false, 'torii resolve a fetch promise');
    }, function(){
      ok(true, 'torii rejected a failed fetch');
    });
  });
});

test("torii closes a dummy-success provider", function(){
  container.register('torii-provider:with-close', DummySuccessProvider.extend({
    fetch: Ember.RSVP.Promise.resolve
  }));
  Ember.run(function(){
    torii.open('with-close', {name: 'dummy'}).then(function(authentication){
      ok(true, 'torii resolves a clos promise');
    }, function(){
      ok(false, 'torii failed to resolves a close promise');
    });
  });
});

test("torii fails to close a dummy-failure provider", function(){
  container.register('torii-provider:with-close', DummyFailureProvider.extend({
    fetch: Ember.RSVP.Promise.reject
  }));
  Ember.run(function(){
    torii.open('with-close').then(function(authentication){
      ok(false, 'torii resolves a close promise');
    }, function(){
      ok(true, 'torii rejected a close open');
    });
  });
});

test('raises on a bad provider name', function(){
  var thrown = false, message;
  try {
    torii.open('bs-man');
  } catch (e) {
    thrown = true;
    message = e.message;
  }
  ok(thrown, "Error thrown");
  ok(/Expected a provider named 'bs-man'/.test(message),
     'correct error thrown');
});

test('raises when calling undefined #open', function(){
  container.register('torii-provider:without-open', DummyFailureProvider.extend({
    open: null
  }));
  var thrown = false, message;
  try {
    torii.open('without-open');
  } catch (e) {
    thrown = true;
    message = e.message;
  }
  ok(thrown, "Error thrown");
  ok(/Expected provider 'without-open' to define the 'open' method/.test(message), 'correct error thrown. was "'+message+'"');
});

test('fails silently when calling undefined #fetch', function(){
  var thrown = false, fetched;
  try {
    Ember.run(function(){
      torii.fetch('dummy-failure').then(function(){
        fetched = true;
      });
    });
  } catch (e) {
    thrown = true;
  }
  ok(!thrown, "Error not thrown");
  ok(fetched, "Promise for fetch resolves");
});

test('fails silently when calling undefined #close', function(){
  var thrown = false, closed;
  try {
    Ember.run(function(){
      torii.close('dummy-failure').then(function(){
        closed = true;
      });
    });
  } catch (e) {
    thrown = true;
  }
  ok(!thrown, "Error not thrown");
  ok(closed, "Promise for close resolves");
});
