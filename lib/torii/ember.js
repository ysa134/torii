import bootstrapTorii from 'torii/bootstrap';
import RedirectHandler from 'torii/redirect-handler';
import Session from 'torii/session';

Ember.onLoad('Ember.Application', function(Application){

  Application.initializer({
    name: 'torii',
    initialize: function(container, app){
      bootstrapTorii(container);
      app.inject('route', 'torii', 'torii:main');
    }
  });

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
