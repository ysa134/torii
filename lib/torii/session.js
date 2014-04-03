import createStateMachine from 'torii/session/state-machine';

function lookupAdapter(container, authenticationType){
  var adapter = container.lookup('torii-adapter:'+authenticationType);
  if (!adapter) {
    adapter = container.lookup('torii-adapter:application');
  }
  return adapter;
}

var Session = Ember.Object.extend({
  isOpening: false,

  stateMachine: function(){
    return createStateMachine(this);
  }.property(),

  // This should become an injection
  torii: function(){
    return this.container.lookup('torii:main');
  }.property(),

  open: function(endpoint){
    var container    = this.container,
        session      = this;

    session.sendTransition('startAuthentication');

    return this.get('torii').open(endpoint).then(function(authentication){

      var adapter = lookupAdapter(
        container, authentication.get('type')
      );

      return adapter.open(authentication);
    }).then(function(user){

      session.set('currentUser', user);
      session.sendTransition('finishAuthentication');
      return user;
    }).catch(function(error){

      session.sendTransition('failAuthentication');
      session.set('errorMessage', error);

      return Ember.RSVP.reject(error);
    });
  },

  sendTransition: function(event){
    this.get('stateMachine').send(event);
  }
});

export default Session;
