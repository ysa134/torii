import ApplicationRouteMixin from 'torii/routing/application-route-mixin';
import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

var AuthenticatedRoute = null;

function reopenOrRegister(container, factoryName, mixin) {
  var factory = container.lookup(factoryName);
  if (factory) {
    factory.reopen(mixin);
  } else {
    if (!AuthenticatedRoute) {
      AuthenticatedRoute = Ember.Route.extend(AuthenticatedRouteMixin);
    }
    container.register(factoryName, AuthenticatedRoute);
  }
}

export default function(container, authenticatedRoutes){
  reopenOrRegister(container, 'route:application', ApplicationRouteMixin);
  for (var i = 0; i < authenticatedRoutes.length; i++) {
    var routeName = authenticatedRoutes[i];
    var factoryName = 'route:' + routeName;
    reopenOrRegister(container, factoryName, AuthenticatedRouteMixin);
  }
}
