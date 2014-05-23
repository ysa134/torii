import requiredProperty from 'torii/lib/required-property';

var Base = Ember.Object.extend({

  // Required settings:
  name: requiredProperty(),

  // API:
  //
  configNamespace: function(){
    return 'endpoints.'+this.get('name');
  }.property('name')

});

export default Base;
