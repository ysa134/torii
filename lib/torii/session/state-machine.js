import StateMachine from 'torii/lib/state-machine';

var transitionTo = StateMachine.transitionTo;
export default function(session){
  var sm = new StateMachine({
    initialState: 'unauthenticated',

    states: {
      unauthenticated: {
        startAuthentication: transitionTo('opening')
      },
      authenticated:   {},
      opening:         {
        finishAuthentication: transitionTo('authenticated'),
        failAuthentication:   transitionTo('error.failedAuthentication')
      },
      'error.failedAuthentication': {}
    },

    afterTransitions: [
      {from: 'unauthenticated', to:'opening',
        fn: function(){
          this.session.set('isOpening',true);
        }
      },
      {from: 'opening', to:'authenticated',
        fn: function(){
          this.session.set('isOpening',false);
          this.session.set('isAuthenticated',true);
        }
      },
      {from: '*', to: 'error.failedAuthentication',
       fn: function(){
         this.session.set('isOpening', false);
         this.session.set('error', true);
       }
      }
    ]
  });
  sm.session = session;
  return sm;
}
