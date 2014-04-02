import RedirectHandler from 'torii/redirect-handler';

var originalPostMessage = window.postMessage;

module('RedirectHandler - Unit', {
  setup: function(){
    window.opener = {postMessage: Ember.K};
  },
  teardown: function(){
    window.opener = null;
  }
});

test('exists', function(){
  ok(RedirectHandler);
});

test('handles a url', function(){
  var url = "http://authServer?code=123451235fw";
  var handler = new RedirectHandler(url);

  Ember.run(function(){
    handler.run().then(function(authData){
      ok(true, "run handler succeeds on basic url");
    }, function(error){
      ok(false, "run handler rejected a basic url");
    });
  });
});

test('rejects a url', function(){
  var url = "http://authServer";
  var handler = new RedirectHandler(url);

  Ember.run(function(){
    handler.run().then(function(authData){
      ok(false, "run handler succeeded on a url");
    }, function(error){
      ok(true, "run handler rejects a url without data");
    });
  });
});

test('posts a message', function(){
  var code = "d29f2jf20j",
      url = "http://authServer?code="+code,
      handler = new RedirectHandler(url);

  window.opener = {
    postMessage: function(message, origin){
      equal(message.code, code, "posts back the code");
      ok(message.__torii_message, "message has __torii_message value");
    }
  };

  Ember.run(function(){
    handler.run();
  });
});
