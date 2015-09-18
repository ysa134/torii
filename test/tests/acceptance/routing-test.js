import startApp from 'test/helpers/start-app';
import configuration from 'torii/configuration';
import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

function lookup(app, key) {
  return app.__container__.lookup(key);
}

var app, originalSessionServiceName;

module('Routing - Acceptance', {
  setup: function(){
    originalSessionServiceName = configuration.sessionServiceName;
    delete configuration.sessionServiceName;
  },

  teardown: function(){
    Ember.run(app, 'destroy');
    configuration.sessionServiceName = originalSessionServiceName;
  }
});

test('ApplicationRoute#checkLogin is not called when no authenticated routes are present', function(assert){
  assert.expect(2);
  configuration.sessionServiceName = 'session';

  var routesConfigured = false;
  var checkLoginCalled = false;

  bootApp({
    map: function() {
      routesConfigured = true;
    },
    setup: function() {
      app.register('route:application', Ember.Route.extend());
    }
  });
  var applicationRoute = lookup(app, 'route:application');
  applicationRoute.reopen({
    checkLogin: function() {
      checkLoginCalled = true;
    }
  });
  applicationRoute.beforeModel();
  assert.ok(routesConfigured, 'Router map was called');
  assert.ok(!checkLoginCalled, 'checkLogin was not called');
});

test('ApplicationRoute#checkLogin is called when an authenticated route is present', function(assert){
  assert.expect(2);
  configuration.sessionServiceName = 'session';

  var routesConfigured = false;
  var checkLoginCalled = false;

  bootApp({
    map: function() {
      routesConfigured = true;
      this.authenticatedRoute('account');
    },
    setup: function() {
      app.register('route:application', Ember.Route.extend());
      app.register('route:account', Ember.Route.extend());
    }
  });
  var applicationRoute = lookup(app, 'route:application');
  applicationRoute.reopen({
    checkLogin: function() {
      checkLoginCalled = true;
    }
  });
  // Foo
  var router = lookup(app, 'router:main');
  router.location.setURL('/');
  applicationRoute.beforeModel();
  assert.ok(routesConfigured, 'Router map was called');
  assert.ok(checkLoginCalled, 'checkLogin was called');
});

test('authenticated routes get authenticate method', function(assert){
  assert.expect(2);
  configuration.sessionServiceName = 'session';

  var checkLoginCalled = false;

  bootApp({
    map: function() {
      this.route('home');
      this.authenticatedRoute('account');
    },
    setup: function() {
      app.register('route:application', Ember.Route.extend());
      app.register('route:account', Ember.Route.extend());
      app.register('route:home', Ember.Route.extend());
    }
  });
  var authenticatedRoute = lookup(app, 'route:account');
  var unauthenticatedRoute = lookup(app, 'route:home');

  assert.ok(authenticatedRoute.authenticate, "authenticate function is present");
  assert.ok(!unauthenticatedRoute.authenticate, "authenticate function is not present");
});

test('lazyily created authenticated routes get authenticate method', function(assert){
  assert.expect(2);
  configuration.sessionServiceName = 'session';

  var checkLoginCalled = false;

  bootApp({
    map: function() {
      this.route('home');
      this.authenticatedRoute('account');
    }
  });
  var applicationRoute = lookup(app, 'route:application');
  var authenticatedRoute = lookup(app, 'route:account');

  assert.ok(applicationRoute.checkLogin, "checkLogin function is present");
  assert.ok(authenticatedRoute.authenticate, "authenticate function is present");
});

function bootApp(attrs) {
  var map = attrs.map || function(){};
  var setup = attrs.setup || function() {};

  var Router = Ember.Router.extend();

  Router.map(map);

  app = startApp({
    loadInitializers: true,
    Router: Router
  });

  setup();

  Ember.run(function(){
    app.advanceReadiness();
  });

  return app.boot();
}
