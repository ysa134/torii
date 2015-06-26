/**
 * RedirectHandler will attempt to find
 * these keys in the URL. If found,
 * this is an indication to Torii that
 * the Ember app has loaded inside a popup
 * and should postMessage this data to window.opener
 */

import PopupIdSerializer from "./lib/popup-id-serializer";


var RedirectHandler = Ember.Object.extend({

  init: function(windowObject){
    this.windowObject = windowObject;
  },

  run: function(){
    var windowObject = this.windowObject;

    return new Ember.RSVP.Promise(function(resolve, reject){
      var popupId = PopupIdSerializer.deserialize(windowObject.name);

      if (popupId){
        var key = PopupIdSerializer.serialize(popupId);
        var url = windowObject.location.toString();

        windowObject.localStorage.setItem(key, url);

        windowObject.close();
      } else{
        reject('Not a torii popup');
      }
    });
  }

});

RedirectHandler.reopenClass({
  // untested
  handle: function(windowObject){
    var handler = new RedirectHandler(windowObject);
    return handler.run();
  }
});

export default RedirectHandler;
