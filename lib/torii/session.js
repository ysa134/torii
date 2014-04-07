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

    sm.send('startOpen');

    return this.get('torii').open(endpoint).then(function(authentication){

      var adapter = lookupAdapter(
        container, authentication.get('type')
      );

      return adapter.open(authentication);
    }).then(function(user){
      sm.send('finishOpen', user);
      return user;
    }).catch(function(error){
      sm.send('failOpen', error);
      return Ember.RSVP.reject(error);
    });
  },

  // TODO define fetch semantics
  fetch: function(endpoint){
    var container    = this.container,
        session      = this,
        sm           = this.get('stateMachine');

    sm.send('startFetch');

    return this.get('torii').fetch(endpoint).then(function(authentication){

      var adapter = lookupAdapter(
        container, authentication.get('type')
      );

      return adapter.fetch(authentication);
    }).then(function(data){
      sm.send('finishFetch', data);
      return;
    }).catch(function(error){
      sm.send('failFetch', error);
      return Ember.RSVP.reject(error);
    });
  },

  close: function(){
    var container    = this.container,
        session      = this,
        sm           = this.get('stateMachine');

    sm.send('startClose');

    var adapter = lookupAdapter(container);

    return adapter.close().then(function(){
      sm.send('finishClose');
    }).catch(function(error){
      sm.send('failClose', error);
      return Ember.RSVP.reject(error);
    });
  }

});

export default Session;
