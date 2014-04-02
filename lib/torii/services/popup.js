function generateNewDeferred(){
  return Ember.RSVP.defer();
}

function rejectDeferred(deferred, message){
  return deferred.reject(message);
}

function resolveDeferred(deferred, data){
  return deferred.resolve(data);
}

var Popup = Ember.Object.extend({

  messageHandler: function(){
    var popup = this;
    return function messageHandler(){
      var data = event.originalEvent.data;
      if (data && data._torii_message) {
        popup.close();
        Ember.run(function(){
          resolveDeferred(popup.deferred, data);
        });
      }
    }
  }.property(),

  close: function(){
    if (this.popup && !this.popup.closed) {
      $(window).off('message.torii');
      this.popup.close();
      this.popup = null;
    }
  },

  open: function(url){
    this.close();

    if (this.deferred) {
      rejectDeferred(this.deferred, 'Popup cancelled by new open request');
      this.deferred = null;
    }

    this.deferred = generateNewDeferred();
    this.popup = window.popup(url, 'torii-auth');

    if (this.popup) {
      this.popup.focus();
      $(window).on('message.torii', this.get('messageHandler'));
    } else {
      rejectDeferred(this.deferred, 'Popup failed to open');
      this.deferred = null;
    }

    return this.deferred.promise;
  }

});

export default Popup;
