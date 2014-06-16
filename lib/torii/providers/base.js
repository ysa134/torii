import requiredProperty from 'torii/lib/required-property';

var Base = Ember.Object.extend({

  // Required settings:
  name: requiredProperty(),

  // API:
  //
  configNamespace: function(){
    return 'providers.'+this.get('name');
  }.property('name')

});

export default Base;
