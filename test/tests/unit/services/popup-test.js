import Popup from 'torii/services/popup';

var popup;
var originalWindowOpen = window.open;

var mockWindow = {
  focus: Ember.K,
  close: Ember.K
};

module("Popup - Unit", {
  setup: function(){
    popup = new Popup();
  },
  teardown: function(){
    window.open = originalWindowOpen;
    Ember.run(popup, 'destroy');
  }
});

asyncTest("open resolves based on popup window", function(){
  var expectedUrl = 'http://authServer',
      expectedData = {__torii_message: true};

  window.open = function(url){
    ok(true, 'calls window.open');
    equal(url, expectedUrl, 'opens with expected url');

    return mockWindow;
  };

  Ember.run(function(){
    popup.open(expectedUrl).then(function(data){
      ok(true, 'resolves promise');
      deepEqual(data, expectedData, 'resolves with expected data');

      start();
    });
  });

  window.postMessage(expectedData, '*');
});
