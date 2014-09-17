import ParseQueryString from 'torii/lib/parse-query-string';

var postMessageFixed;
var postMessageDomain = window.location.protocol+'//'+window.location.host;
var postMessagePrefix = "__torii_message:";
// in IE11 window.attachEvent was removed.
if (window.attachEvent) {
  postMessageFixed = function postMessageFixed(win, data) {
    win.postMessageWithFix(postMessagePrefix+data, postMessageDomain);
  };
  window.postMessageWithFix = function postMessageWithFix(data, domain) {
    setTimeout(function(){
      window.postMessage(data, domain);
    }, 0);
  };
} else {
  postMessageFixed = function postMessageFixed(win, data) {
    win.postMessage(postMessagePrefix+data, postMessageDomain);
  };
}

export {postMessageFixed};

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
  return Ember.$.extend({
    left: ((screen.width / 2) - (width / 2)),
    top: ((screen.height / 2) - (height / 2)),
    width: width,
    height: height
  }, options);
}

function readToriiMessage(message){
  if (message && typeof message === 'string' && message.indexOf(postMessagePrefix) === 0) {
    return message.slice(postMessagePrefix.length);
  }
}

export {readToriiMessage};

function parseMessage(url, keys){
  var parser = new ParseQueryString(url, keys),
      data = parser.parse();
  return data;
}

var Popup = Ember.Object.extend(Ember.Evented, {

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
    var service   = this,
        lastPopup = this.popup;

    var oldName = window.name;
    // Is checked by the popup to see if it was opened by Torii
    window.name = 'torii-opener';

    return new Ember.RSVP.Promise(function(resolve, reject){
      if (lastPopup) {
        service.close();
      }

      var optionsString = stringifyOptions(prepareOptions(options || {}));
      service.popup = window.open(url, 'torii-auth', optionsString);

      if (service.popup && !service.popup.closed) {
        service.popup.focus();
      } else {
        reject(new Error(
          'Popup could not open or was closed'));
        return;
      }

      service.one('didClose', function(){
        reject(new Error(
          'Popup was closed or authorization was denied'));
      });

      Ember.$(window).on('message.torii', function(event){
        var message = event.originalEvent.data;
        var toriiMessage = readToriiMessage(message);
        if (toriiMessage) {
          var data = parseMessage(toriiMessage, keys);
          resolve(data);
        }
      });

      service.schedulePolling();

    }).finally(function(){
      // didClose will reject this same promise, but it has already resolved.
      service.close();
      window.name = oldName;
      Ember.$(window).off('message.torii');
    });
  },

  close: function(){
    if (this.popup) {
      this.popup = null;
      this.trigger('didClose');
    }
  },

  pollPopup: function(){
    if (!this.popup) {
      return;
    }
    if (this.popup.closed) {
      this.trigger('didClose');
    }
  },

  schedulePolling: function(){
    this.polling = Ember.run.later(this, function(){
      this.pollPopup();
      this.schedulePolling();
    }, 35);
  },

  stopPolling: function(){
    Ember.run.cancel(this.polling);
  }.on('didClose'),


});

export default Popup;
