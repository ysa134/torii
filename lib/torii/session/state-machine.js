import StateMachine from 'torii/lib/state-machine';

var transitionTo = StateMachine.transitionTo;
export default function(session){
  var sm = new StateMachine({
    initialState: 'unauthenticated',

    states: {
      unauthenticated: {
        // Actions
        startOpen: transitionTo('opening'),
        startFetch: transitionTo('fetching')
      },
      authenticated: {
        // Properties
        currentUser: null,
        isAuthenticated: true,
        startClose: transitionTo('closing')
      },
      opening: {
        isWorking: true,
        isOpening: true,
        // Actions
        finishOpen: function(data){
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              this.states['authenticated'][key] = data[key];
            }
          }
          this.transitionTo('authenticated');
        },
        failOpen: function(errorMessage){
          this.states['error.open'].errorMessage = errorMessage;
          this.transitionTo('error.open')
        }
      },
      fetching: {
        isWorking: true,
        isOpening: true,
        // Actions
        finishFetch: function(currentUser){
          this.states['authenticated'].currentUser = currentUser;
          this.transitionTo('authenticated');
        },
        failOpen: function(errorMessage){
          this.states['error.fetch'].errorMessage = errorMessage;
          this.transitionTo('error.fetch')
        }
      },
      closing: {
        isWorking: true,
        isClosing: true,
        isAuthenticated: true,
        // Actions
        finishClose: function(){
          this.transitionTo('unauthenticated');
        },
        failClose: function(errorMessage){
          this.states['error.close'].errorMessage = errorMessage;
          this.transitionTo('error.close')
        }
      },
      'error.open': {
        // Properties
        errorMessage: null
      },
      'error.fetch': {
        // Properties
        errorMessage: null
      },
      'error.close': {
        // Properties
        errorMessage: null
      }
    }
  });
  sm.session = session;
  return sm;
}
