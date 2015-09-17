import toriiContainer from 'test/helpers/torii-container';

var container, registry;

module("boostrapTorii", {
  setup: function(){
    var results = toriiContainer();
    registry = results[0];
    container = results[1];
  },
  teardown: function(){
    Ember.run(container, 'destroy');
  }
});

test("inject popup onto providers", function(){
  registry.register('torii-provider:foo', Ember.Object.extend());
  ok(container.lookup('torii-provider:foo').get('popup'), 'Popup is set');
});
