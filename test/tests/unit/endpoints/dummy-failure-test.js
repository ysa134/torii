var endpoint;

import Endpoint from 'torii/endpoints/dummy-failure';

module('DummyFailureEndpoint - Unit', {
  setup: function(){
    endpoint = new Endpoint();
  },
  teardown: function(){
    Ember.run(endpoint, 'destroy');
  }
});

test("Endpoint rejects on open", function(){
  Ember.run(function(){
    endpoint.open().then(function(){
      ok(false, 'dummy-success fulfilled an open promise');
    }, function(){
      ok(true, 'dummy-success fails to resolve an open promise');
    });
  });
});
