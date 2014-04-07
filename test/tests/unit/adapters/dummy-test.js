import DummyAdapter from 'torii/adapters/dummy';

var adapter;

module("DummyAdapter - Unit", {
  setup: function(){
    adapter = new DummyAdapter();
  },
  teardown: function() {
    Ember.run(adapter, 'destroy');
  }
});

test("open resolves with a user", function(){
  Ember.run(function(){
    adapter.open().then(function(data){
      ok(true, 'resolved');
      ok(Ember.get(data,'currentUser.email'), 'dummy user has email');
    });
  });
});
