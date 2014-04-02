var authorizationKeys = [
  'code'
];

var RedirectHandler = Ember.Object.extend({

  init: function(url){
    this.url = url;
  },

  run: function(){
    var data = this.parseUrl();
    return new Ember.RSVP.Promise(function(resolve, reject){
      if (Ember.keys(data).get('length') > 0) {
        data.__torii_message = true;
        window.opener.postMessage(data, '*');
        resolve(data);
      } else {
        reject("No data found");
      }
    });
  },

  parseUrl: function(){
    var url = this.url,
        data = {};
    for (var i = 0; i < authorizationKeys.length; i++) {
      var key = authorizationKeys[i],
          regex = new RegExp(key + "=([^&]*)"),
          match = regex.exec(url);
      if (match) {
        data[key] = match[1];
      }
    }
    return data;
  }

});

RedirectHandler.reopenClass({
  // untested
  handle: function(url){
    var handler = new RedirectHandler(url);
    return handler.run();
  }
});

export default RedirectHandler;
