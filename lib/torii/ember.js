import bootstrapTorii from 'torii/bootstrap';
import RedirectHandler from 'torii/redirect-handler';
import Session from 'torii/session';
import Torii from 'torii';

import configuration from 'torii/configuration';

Ember.onLoad('Ember.Application', function(Application){

  Application.initializer({
    name: 'torii-callback',
    initialize: function(container, app){
      app.deferReadiness();
      RedirectHandler.handle(window.location.toString()).catch(function(){
        app.advanceReadiness();
      });
    }
  });

  Application.initializer({
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
  });

  Application.initializer({
    name: 'torii-session',
    after: 'torii',

    initialize: function(container, app){

      if (configuration.sessionServiceName) {
        var sessionName = configuration.sessionServiceName;
        app.register('torii:session', Session);
        app.inject('torii:session', 'torii', 'torii:main');
        app.inject('route',      sessionName, 'torii:session');
        app.inject('controller', sessionName, 'torii:session');
      }
    }
  });
});

export default Torii;
