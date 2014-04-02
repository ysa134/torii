/* global $ */

function generateNewDeferred(){
  return Ember.RSVP.defer();
}

function rejectDeferred(deferred, message){
  return deferred.reject(message);
}

function resolveDeferred(deferred, data){
  return deferred.resolve(data);
}

function stringifyOptions(options){
  var optionsStrings = [];
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      var value;
      switch (options[key]) {
        case true:
          value = '1';
          break;
        case false:
          value = '0';
          break;
        default:
          value = options[key];
      }
      optionsStrings.push(
        key+"="+value
      );
    }
  }
  return optionsStrings.join(',');
}

function prepareOptions(options){
  var width = options.width || 500,
      height = options.height || 500;
  return $.merge({
    left: ((screen.width / 2) - (width / 2)),
    top: ((screen.height / 2) - (height / 2)),
    width: width,
    height: height
  }, options);
}

var Popup = Ember.Object.extend({

  messageHandler: function(){
    var popup = this;
    return function messageHandler(event){
      var data = event.originalEvent.data;
      if (data && data.__torii_message) {
        popup.close();
        Ember.run(function(){
          resolveDeferred(popup.deferred, data);
        });
      }
    };
  }.property(),

  close: function(){
    if (this.popup && !this.popup.closed) {
      $(window).off('message.torii');
      this.popup.close();
      this.popup = null;
    }
  },

  open: function(url, options){
    this.close();

    if (this.deferred) {
      rejectDeferred(this.deferred, 'Popup cancelled by new open request');
      this.deferred = null;
    }

    this.deferred = generateNewDeferred();

    var optionsString = stringifyOptions(prepareOptions(options || {}));
    this.popup = window.open(url, 'torii-auth', optionsString);

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
