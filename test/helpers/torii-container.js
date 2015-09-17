import bootstrapTorii from 'torii/bootstrap/torii';

export default function toriiContainer(fullNames) {
  var registry = new Ember.Registry();
  var container = registry.container();
  var mockApp = {
    register: function() {
      registry.register.apply(registry, arguments);
    },
    inject: function() {
      registry.injection.apply(registry, arguments);
    },
    has: function() {
      registry.has.apply(registry, arguments);
    }
  };
  bootstrapTorii(mockApp);
  return [registry, container];
}
