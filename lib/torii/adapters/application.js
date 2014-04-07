var ApplicationAdapter = Ember.Object.extend({

  open: function(authentication){
    throw new Error('must be implemented');

    // For example
    return Ember.RSVP.resolve(Ember.$.getJSON({
      url: '/session',
      data: {
        authorizationCode: authentication.authorizationCode,
        service: authentication.type
      }
    })).then(function(data){
      return User.create(data);
    });
  },

  close: function(){
    throw new Error('must be implemented');

    // For example
    return Ember.RSVP.resolve(Ember.$.ajax({
      url: '/session',
      method: 'DELETE',
      data: {}
    })).then(function(data){
      return true;
    });
  }

});

export default ApplicationAdapter;
