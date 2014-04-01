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
