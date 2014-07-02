import bootstrapTorii from 'torii/bootstrap/torii';

var container;

module("boostrapTorii", {
  setup: function(){
    container = new Ember.Container();
  },
  teardown: function(){
    Ember.run(container, 'destroy');
  }
});

test("inject popup onto providers", function(){
  container.register('torii-provider:foo', Ember.Object.extend());
  bootstrapTorii(container);
  ok(container.lookup('torii-provider:foo').get('popup'), 'Popup is set');
});
