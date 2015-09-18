import configuration from 'torii/configuration';

export default Ember.Mixin.create({
  beforeModel: function (transition) {
    var route = this;
    var superBefore = this._super.apply(this, arguments);
    if (superBefore && superBefore.then) {
      return superBefore.then(function() {
        return route.authenticate(transition);
      });
    } else {
      return route.authenticate(transition);
    }
  },
  authenticate: function (transition) {
    var route = this,
      session = this.get(configuration.sessionServiceName),
      isAuthenticated = this.get(configuration.sessionServiceName + '.isAuthenticated');
    if (isAuthenticated === undefined) {
      session.attemptedTransition = transition;
      return session.fetch()
        .catch(function() {
          return route.accessDenied(transition);
        });
    } else if (isAuthenticated) {
      // no-op; cause the user is already authenticated
      return Ember.RSVP.resolve();
    } else {
      return this.accessDenied(transition);
    }
  },
  accessDenied: function (transition) {
    transition.send('accessDenied');
  }
});
