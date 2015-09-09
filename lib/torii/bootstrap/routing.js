import ApplicationRouteMixin from 'torii/routing/application-route-mixin';
import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

var AuthenticatedRoute = null;

function reopenOrRegister(container, factoryName, mixin) {
  var factory = container.lookup(factoryName);
  var basicFactory;
  
  if (factory) {
    factory.reopen(mixin);
  } else {
    basicFactory = container.lookupFactory('route:basic');
    if (!AuthenticatedRoute) {
      AuthenticatedRoute = basicFactory.extend(AuthenticatedRouteMixin);
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
