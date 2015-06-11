import RedirectHandler from 'torii/redirect-handler';

var originalPostMessage = window.postMessage;
var originalClose = window.close;

module('RedirectHandler - Unit', {
  setup: function(){
    window.name = '_blank';
    window.opener = {
      name: 'torii-opener',
      postMessage: Ember.K
    };
    window.close = Ember.K;
  },
  teardown: function(){
    window.name = null;
    window.opener = null;
    window.postMessage = originalPostMessage;
    window.close = originalClose;
  }
});

test('exists', function(){
  ok(RedirectHandler);
});

test('handles a url', function(){
  var url = "http://authServer?code=123451235fw";
  var handler = new RedirectHandler(url);

  Ember.run(function(){
    handler.run().then(function(){}, function(error){
      ok(false, "run handler rejected a basic url");
    });
  });

  ok(!handler.isFulfilled, "hangs the return promise forever");
});

test('rejects a url', function(){
  window.opener = null;

  var url = "http://authServer";
  var handler = new RedirectHandler(url);

  Ember.run(function(){
    handler.run().then(function(){
      ok(false, "run handler succeeded on a url");
    }, function(error){
      ok(true, "run handler rejects a url without data");
    });
  });
});

test('does not post a message', function(){
  var url = "http://authServer";
  var handler = new RedirectHandler(url);

  window.opener = {
    name: 'some-other-name',
    postMessage: function(message, origin){
      ok(false, "message was received");
    }
  };

  Ember.run(function(){
    handler.run().then(function(){
      ok(false, "run handler succeeded on a popup");
    }, function(error){
      ok(true, "run handler rejects a popup without a name");
    });
  });
});

test('closes the window on no data in url', function(){
  expect(1);
  var url = "http://authServer";
  var handler = new RedirectHandler(url);

  window.close = function(){
    ok(true, "Window was closed");
  };

  Ember.run(function(){
    handler.run().then(function(){
      ok(false, "run handler succeeded on a popup");
    }, function(error){
      ok(false, "run handler rejects a popup without a name (should hang)");
    });
  });
});

test('posts a message', function(){
  var code = "d29f2jf20j",
      url = "http://authServer?code="+code,
      handler = new RedirectHandler(url);

  window.opener = {
    name: 'torii-opener',
    postMessage: function(message, origin){
      equal(message, "__torii_message:"+url, "posts back the url");
    }
  };

  Ember.run(function(){
    handler.run();
  });
});

test('closes the window', function(){
  var code = "d29f2jf20j",
      url = "http://authServer?code="+code,
      handler = new RedirectHandler(url);

  window.close = function(){
    ok(true, "Window was closed");
  };

  Ember.run(function(){
    handler.run();
  });
});
