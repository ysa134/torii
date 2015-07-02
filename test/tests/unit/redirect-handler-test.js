import RedirectHandler from 'torii/redirect-handler';

function buildMockWindow(windowName, url){
  return {
    name: windowName,
    location: {
      toString: function(){
        return url;
      }
    },
    localStorage: {
      setItem: Ember.K,
      getItem: Ember.K
    },
    close: Ember.K
  };
}

module('RedirectHandler - Unit');

test('exists', function(){
  ok(RedirectHandler);
});

test("handles a tori-popup window with a url", function(){

  var mockWindow = buildMockWindow("torii-popup:abc123", "http://authServer?code=1234512345fw");
  var handler = new RedirectHandler(mockWindow);

  Ember.run(function(){
    handler.run().then(function(){}, function(error){
      ok(false, "run handler rejected a basic url");
    });
  });

  ok(!handler.isFulfilled, "hangs the return promise forever");
});

test('rejects the promise if the window is not named like a torii popup', function(){

  var mockWindow = buildMockWindow("", "http://authServer?code=1234512345fw");
  var handler = new RedirectHandler(mockWindow);

  Ember.run(function(){
    handler.run().then(function(){
      ok(false, "run handler succeeded on a url");
    }, function(error){
      ok(true, "run handler rejects a url without data");
    });
  });
});

test("sets the local storage when it's a torii popup", function(){
  expect(2);
  var mockWindow = buildMockWindow("torii-popup:abc123", "http://authServer?code=1234512345fw");
  mockWindow.localStorage.setItem = function(key, value) {
    equal(key, "torii-popup:abc123");
    equal(value, "http://authServer?code=1234512345fw");
  }

  var handler = new RedirectHandler(mockWindow);

  handler.run();
});

test('does not set local storage when not a torii popup', function(){
  expect(1);
  var mockWindow = buildMockWindow("", "http://authServer?code=1234512345fw");
  mockWindow.localStorage.setItem = function(key, value) {
    ok(false, "storage was set unexpectedly");
  }

  var handler = new RedirectHandler(mockWindow);

  Ember.run(function(){
    handler.run().then(function(){
      ok(false, "run handler succeeded on a popup");
    }, function(error){
      ok(true, "run handler rejects a popup without a name");
    });
  });
});

test('closes the window when a torii popup', function(){
  expect(1);

  var mockWindow = buildMockWindow("torii-popup:abc123", "http://authServer?code=1234512345fw");

  var handler = new RedirectHandler(mockWindow);

  mockWindow.close = function(){
    ok(true, "Window was closed");
  };

  Ember.run(function(){
    handler.run();
  });
});

test('does not close the window when a not torii popup', function(){
  expect(1);

  var mockWindow = buildMockWindow("", "http://authServer?code=1234512345fw");

  var handler = new RedirectHandler(mockWindow);

  mockWindow.close = function(){
    ok(false, "Window was closed unexpectedly");
  };

  Ember.run(function(){
    handler.run().then(function(){}, function(error){
      ok(true, "error handler is called");
    });
  });
});
