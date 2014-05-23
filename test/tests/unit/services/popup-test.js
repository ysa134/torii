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
      expectedData = "__torii_message:http://someurl.com?code=fr";

  window.open = function(url){
    ok(true, 'calls window.open');
    equal(url, expectedUrl, 'opens with expected url');

    return mockWindow;
  };

  Ember.run(function(){
    popup.open(expectedUrl, ['code']).then(function(data){
      ok(true, 'resolves promise');
      deepEqual(data, {code: 'fr'}, 'resolves with expected data');
      start();
    }, function(){
      ok(false, 'rejected the open promise');
      start();
    });
  });

  window.postMessage(expectedData, '*');
});

asyncTest("open rejects when window does not open", function(){
  var closedWindow = Ember.copy(mockWindow);
  closedWindow.closed = true;
  window.open = function(url){
    ok(true, 'calls window.open');
    return closedWindow;
  };

  Ember.run(function(){
    popup.open('http://some-url.com', ['code']).then(function(data){
      ok(false, 'resolves promise');
      start();
    }, function(){
      ok(true, 'rejected the open promise');
      start();
    });
  });
});

asyncTest("open does not resolve when recieving the wrong message", function(){
  window.open = function(url){
    ok(true, 'calls window.open');
    return mockWindow;
  };

  var promise = Ember.run(function(){
    return popup.open('http://someserver.com', ['code']).then(function(data){
      ok(false, 'resolves the open promise');
      start();
    }, function(){
      ok(false, 'rejected the open promise');
      start();
    });
  });

  window.postMessage('somenotvaliddata', '*');
  setTimeout(function(){
    ok(!promise.isFulfilled, 'promise is not fulfulled by invalid data');
    start();
  },10);
});

asyncTest("open rejects when window closes", function(){
  window.open = function(){
    ok(true, 'calls window.open');
    return mockWindow;
  };

  Ember.run(function(){
    popup.open('some-url', ['code']).then(function(){
      ok(false, 'resolved the open promise');
      start();
    }, function(){
      ok(true, 'rejected the open promise');
      start();
    });
  });

  mockWindow.closed = true;
});
