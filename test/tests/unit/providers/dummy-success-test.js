var provider;

import Provider from 'test/helpers/dummy-success-provider';

module('DummySuccessProvider - Unit', {
  setup: function(){
    provider = Provider.create();
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
