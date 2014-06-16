var provider;

import Provider from 'torii/providers/dummy-success';

module('DummySuccessProvider - Unit', {
  setup: function(){
    provider = new Provider();
  },
  teardown: function(){
    Ember.run(provider, 'destroy');
  }
});

test("Provider fulfills on open", function(){
  Ember.run(function(){
    provider.open().then(function(){
      ok(true, 'dummy-success resolves an open promise');
    }, function(){
      ok(false, 'dummy-success failed to resolves an open promise');
    });
  });
});
