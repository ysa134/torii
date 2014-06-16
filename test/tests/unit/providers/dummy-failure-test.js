var provider;

import Provider from 'torii/providers/dummy-failure';

module('DummyFailureProvider - Unit', {
  setup: function(){
    provider = new Provider();
  },
  teardown: function(){
    Ember.run(provider, 'destroy');
  }
});

test("Provider rejects on open", function(){
  Ember.run(function(){
    provider.open().then(function(){
      ok(false, 'dummy-success fulfilled an open promise');
    }, function(){
      ok(true, 'dummy-success fails to resolve an open promise');
    });
  });
});
