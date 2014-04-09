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
