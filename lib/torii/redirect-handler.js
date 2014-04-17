/**
 * RedirectHandler will attempt to find
 * these keys in the URL. If found,
 * this is an indication to Torii that
 * the Ember app has loaded inside a popup
 * and should postMessage this data to window.opener
 */
var authorizationKeys = [
  'code'
];

import ParseQueryString from 'torii/lib/parse-query-string';

var RedirectHandler = Ember.Object.extend({

  init: function(url){
    this.url = url;
  },

  run: function(){
    var data = this.parseUrl();
    return new Ember.RSVP.Promise(function(resolve, reject){
      if (!window.opener) {
        reject('No window.opener');
      } else if (Ember.keys(data).get('length') < 1) {
        reject("No data found");
      } else {
        data.__torii_message = true;
        window.opener.postMessage(data, '*');
        resolve(data);
      }
    });
  },

  parseUrl: function(){
    var parser = new ParseQueryString(this.url,
                                      authorizationKeys);

    return parser.parse();
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
