import StateMachine from 'torii/lib/state-machine';

var transitionTo = StateMachine.transitionTo;
export default function(session){
  var sm = new StateMachine({
    initialState: 'unauthenticated',

    states: {
      unauthenticated: {
        // Actions
        startAuthentication: transitionTo('opening')
      },
      authenticated: {
        // Properties
        currentUser: null,
        isAuthenticated: true
      },
      opening: {
        isOpening: true,
        // Actions
        finishAuthentication: function(currentUser){
          this.states['authenticated'].currentUser = currentUser;
          this.transitionTo('authenticated');
        },
        failAuthentication: function(errorMessage){
          this.states['error.failedAuthentication'].errorMessage = errorMessage;
          this.transitionTo('error.failedAuthentication')
        }
      },
      'error.failedAuthentication': {
        // Properties
        errorMessage: null
      }
    }
  });
  sm.session = session;
  return sm;
}
