import DummyAdapter from 'test/helpers/dummy-adapter';

var adapter;

module("DummyAdapter - Unit", {
  setup: function(){
    adapter = DummyAdapter.create();
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
