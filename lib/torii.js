var Torii = Ember.Object.extend({

  open: function(endpointName){
    var endpoint = this.container.lookup('torii-endpoint:'+endpointName);
    return endpoint.open();
  }

});

export default Torii;
