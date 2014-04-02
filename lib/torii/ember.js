import bootstrapTorii from 'torii/bootstrap';

Ember.onLoad('Ember.Application', function(Application){

  Application.initializer({
    name: 'torii',
    initialize: function(container, app){
      var torii = bootstrapTorii(container);
      app.inject('route', 'torii', 'torii:main');
    }
  });
});

Ember.onLoad('Ember.Application', function(Application){

  Application.initializer({
    name: 'torii-callback',
    initialize: function(container, app){
      var matcher = /code=([^&]*)/;
      var match = matcher.exec(window.location.search);
      if (match) {
        console.log('got code!',match[1]);
        app.deferReadiness();
      }
    }
  });
});
