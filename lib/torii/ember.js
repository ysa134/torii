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

      // Walk all configured endpoints and eagerly instantiate
      // them. This gives endpoints like Facebook a change to
      // load up assets.
      for (var key in  configuration.endpoints) {
        if (configuration.endpoints.hasOwnProperty(key)) {
          container.lookup('torii-endpoint:'+key);
        }
      }

      app.inject('route', 'torii', 'torii:main');
    }
  });

  Application.initializer({
    name: 'torii-session',
    after: 'torii',

    initialize: function(container, app){
      app.register('torii:session', Session);
      app.inject('torii:session', 'torii', 'torii:main');
      app.inject('route',      'session', 'torii:session');
      app.inject('controller', 'session', 'torii:session');
    }
  });
});

export default Torii;
