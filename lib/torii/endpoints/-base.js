var Base = Ember.Object.extend({

  // Required settings:
  name: Ember.required(),

  // API:
  //
  configNamespace: function(){
    return 'endpoints.'+this.get('name');
  }.property('name')

});

export default Base;
