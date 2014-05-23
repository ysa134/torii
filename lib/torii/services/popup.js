import ParseQueryString from 'torii/lib/parse-query-string';

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
  return Ember.$.merge({
    left: ((screen.width / 2) - (width / 2)),
    top: ((screen.height / 2) - (height / 2)),
    width: width,
    height: height
  }, options);
}

var messagePrefix = '__torii_message:'

var Popup = Ember.Object.extend({

  messageHandler: function(){
    var popup = this;
    return function messageHandler(event){
      var data = event.originalEvent.data;
      if (data && data.indexOf(messagePrefix) === 0) {
        var url = data.slice(messagePrefix.length),
            parser = new ParseQueryString(url, popup.keys);
            data = parser.parse();
        popup.close();
        Ember.run(function(){
          resolveDeferred(popup.deferred, data);
        });
      }
    };
  }.property(),

  close: function(){
    if (this.popup && !this.popup.closed) {
      Ember.$(window).off('message.torii');
      this.popup.close();
      this.popup = null;
      this.keys  = null;
    }
  },

  // Open a popup window. Returns a promise that resolves or rejects
  // accoring to if the popup is redirected with arguments in the URL.
  //
  // For example, an OAuth2 request:
  //
  // popup.open('http://some-oauth.com', ['code']).then(function(data){
  //   // resolves with data.code, as from http://app.com?code=13124
  // });
  //
  open: function(url, keys, options){
    this.close();

    if (this.deferred) {
      rejectDeferred(this.deferred, 'Popup cancelled by new open request');
      this.deferred = null;
    }

    // TODO: deferreds are going away, use a promise
    this.deferred = generateNewDeferred();

    var optionsString = stringifyOptions(prepareOptions(options || {}));
    this.popup = window.open(url, 'torii-auth', optionsString);
    this.keys  = keys;

    if (this.popup) {
      this.popup.focus();
      Ember.$(window).on('message.torii', this.get('messageHandler'));
    } else {
      rejectDeferred(this.deferred, 'Popup failed to open');
      this.deferred = null;
    }

    return this.deferred.promise;
  }

});

export default Popup;
