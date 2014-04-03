import createStateMachine from 'torii/session/state-machine';

function lookupAdapter(container, authenticationType){
  var adapter = container.lookup('torii-adapter:'+authenticationType);
  if (!adapter) {
    adapter = container.lookup('torii-adapter:application');
  }
  return adapter;
}

var Session = Ember.ObjectProxy.extend({
  state: null,

  stateMachine: function(){
    return createStateMachine(this);
  }.property(),

  setupStateProxy: function(){
    var sm = this.get('stateMachine'),
        proxy = this;
    sm.on('didTransition', function(){
      proxy.set('content', sm.state);
      proxy.set('currentStateName', sm.currentStateName);
    });
  }.on('init'),

  // Make these properties one-way. Maybe.
  setUnknownProperty: Ember.K,

  open: function(endpoint){
    var container    = this.container,
        session      = this,
        sm           = this.get('stateMachine');

    sm.send('startAuthentication');

    return this.get('torii').open(endpoint).then(function(authentication){

      var adapter = lookupAdapter(
        container, authentication.get('type')
      );

      return adapter.open(authentication);
    }).then(function(user){
      sm.send('finishAuthentication', user);
      return user;
    }).catch(function(error){
      sm.send('failAuthentication', error);
      return Ember.RSVP.reject(error);
    });
  }

});

export default Session;
