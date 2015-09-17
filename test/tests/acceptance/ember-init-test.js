import startApp from 'test/helpers/start-app';
import configuration from 'torii/configuration';
import {
  lookup,
  lookupFactory
} from 'torii/lib/container-utils';

var app, originalSessionServiceName;

module('Ember Initialization - Acceptance', {
  setup: function(){
    originalSessionServiceName = configuration.sessionServiceName;
    delete configuration.sessionServiceName;
  },

  teardown: function(){
    Ember.run(app, 'destroy');
    configuration.sessionServiceName = originalSessionServiceName;
  }
});

test('session is not injected by default', function(){
  app = startApp();
  ok(!lookup(app, 'service:session'));

  app.register('controller:application', Ember.Controller.extend());
  var controller = lookup(app, 'controller:application');
  ok(!controller.get('session'), 'controller has no session');
});

test('session is injected with the name in the configuration', function(){
  configuration.sessionServiceName = 'wackySessionName';

  app = startApp({loadInitializers: true});
  ok(lookup(app, 'service:wackySessionName'), 'service:wackySessionName is injected');

  app.register('controller:application', Ember.Controller.extend());
  var controller = lookup(app, 'controller:application');

  ok(controller.get('wackySessionName'),
     'Controller has session with accurate name');

  ok(!controller.get('session'),
     'Controller does not have "session" property name');
});

test('session is injectable using inject.service', function(){
  configuration.sessionServiceName = 'session';

  app = startApp({loadInitializers: true});
  ok(lookup(app, 'service:session'), 'service:session is injected');

  app.register('component:testComponent', Ember.Component.extend({
    session: Ember.inject.service('session'),
    torii: Ember.inject.service('torii')
  }));

  var component = lookupFactory(app, 'component:testComponent').create();

  ok(component.get('session'), 'Component has access to injected session service');
  ok(component.get('torii'), 'Component has access to injected torii service');
});
