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
  }

});

export default ApplicationAdapter;
