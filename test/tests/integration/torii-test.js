var container, torii;

import toriiContainer from 'test/helpers/torii-container';

module('Torii - Integration', {
  setup: function(){
    container = toriiContainer();
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
      ok(false, 'torii failed to resolves an open promise');
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

test('raises on a bad provider name', function(){
  var thrown = false, message;
  try {
    torii.open('bs-man');
  } catch (e) {
    thrown = true;
    message = e.message;
  }
  ok(thrown, "Error thrown");
  ok(/Expected an provider named bs-man/.test(message), 'correct error thrown');
});
