export function stubValidSession(application,currentUser) {
  var session = application.__container__.lookup('torii:session');
  var sm = session.get('stateMachine');
  Ember.run(function() {
    sm.transitionTo('authenticated');
    session.set('content.currentUser', currentUser);
  });
}
