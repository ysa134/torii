function lookupAdapter(container, authenticationType){
  var adapter = container.lookup('torii-adapter:'+authenticationType);
  if (!adapter) {
    adapter = container.lookup('torii-adapter:application');
  }
  return adapter;
}

var Session = Ember.Object.extend({
  isOpening: false,

  // This should become an injection
  torii: function(){
    return this.container.lookup('torii:main');
  }.property(),

  open: function(endpoint){
    var stateMachine = this.stateMachine,
        container    = this.container,
        session      = this;

    stateMachine.transitionTo('opening');
    return this.get('torii').open(endpoint).then(function(authentication){
      stateMachine.transitionTo('confirming');

      var adapter = lookupAdapter(
        container, authentication.get('type')
      );

      return adapter.open(authentication);
    }).then(function(user){
      // TODO where do these messages go?
      session.set('currentUser', user);
      stateMachine.transitionTo('opened');
      return user;
    }).catch(function(error){
      // TODO where do these messages go?
      session.set('errorMessage', error);
      stateMachine.transitionTo('error');
      return Ember.RSVP.reject(error);
    });
  },

  stateMachine: {
    transitionTo: function(state){
      this.state = state;
    },
    state: null
  }
});

export default Session;
