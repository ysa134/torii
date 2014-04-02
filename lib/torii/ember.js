import bootstrapTorii from 'torii/bootstrap';
import RedirectHandler from 'torii/redirect-handler';

var MATCH_CODE = /code=([^&]*)/;
function handleAuthorizationResponse(app, urlFragment){
  var match = matcher.exec(urlFragment);
  if (!match) { return; }
  var code = match[1];
}

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
});
