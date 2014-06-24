import bootstrapTorii from 'torii/bootstrap';
import configuration from 'torii/configuration';

export default {
  name: 'torii',
  after: 'torii-callback',
  initialize: function(container, app){
    bootstrapTorii(container);

    // Walk all configured providers and eagerly instantiate
    // them. This gives providers with initialization side effects
    // like facebook-connect a chance to load up assets.
    for (var key in  configuration.providers) {
      if (configuration.providers.hasOwnProperty(key)) {
        container.lookup('torii-provider:'+key);
      }
    }

    app.inject('route', 'torii', 'torii:main');
  }
};
