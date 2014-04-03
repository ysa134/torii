var configuration = {
  read: function(path){
    var value = Ember.get(this, path);
    if (typeof value !== 'undefined') {
      return value;
    } else {
      throw new Error("Expected configuration value "+path+" to be defined!");
    }
  },
  endpoints: {
  },
};

export default configuration;
