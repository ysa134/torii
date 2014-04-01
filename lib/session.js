var Session = Ember.Object.extend({
  isOpening: false,

  // This should become an injection
  torii: function(){
    return this.container.lookup('torii:main');
  }.property(),

  // This should become an injection
  adapter: function(){
    return this.container.lookup('torii-adapter:main');
  }.property(),

  open: function(endpoint){
    var stateMachine = this.stateMachine,
        container    = this.container;
    stateMachine.transitionTo('opening');
    this.get('torii').open(endpoint).then(function(authentication){
      stateMachine.transitionTo('confirming');

      var adapter = container.lookup('torii-adapter:'+authentication.get('type'));
      if (!adapter) {
        adapter = container.lookup('torii-adapter:application');
      }

      return adapter.open(authentication);
    }).then(function(user){
      // TODO where do these messages go?
      this.set('currentUser', user);
      stateMachine.transitionTo('opened');
    }).catch(function(error){
      // TODO where do these messages go?
      this.set('errorMessage', error);
      stateMachine.transitionTo('error');
      return Ember.RSVP.reject(error);
    });
  },

  stateMachine: {
    transitionTo: function(state){
      throw new Error('not implemented');
      this.state = state;
    },
    state: null
  }


});

export default Session;
