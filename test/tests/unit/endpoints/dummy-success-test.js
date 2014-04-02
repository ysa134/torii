var endpoint;

import Endpoint from 'torii/endpoints/dummy-success';

module('DummySuccessEndpoint - Unit', {
  setup: function(){
    endpoint = new Endpoint();
  },
  teardown: function(){
    Ember.run(endpoint, 'destroy');
  }
});

test("Endpoint fulfills on open", function(){
  Ember.run(function(){
    endpoint.open().then(function(){
      ok(true, 'dummy-success resolves an open promise');
    }, function(){
      ok(false, 'dummy-success failed to resolves an open promise');
    });
  });
});
