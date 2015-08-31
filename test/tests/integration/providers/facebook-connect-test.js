var torii, container;

import buildFBMock from 'test/helpers/build-fb-mock';
import toriiContainer from 'test/helpers/torii-container';
import configuration from 'torii/configuration';

var originalConfiguration = configuration.providers['facebook-connect'],
    originalGetScript = $.getScript,
    originalFB = window.FB;

module('Facebook Connect - Integration', {
  setup: function(){
    container = toriiContainer();
    torii = container.lookup('service:torii');
    configuration.providers['facebook-connect'] = {appId: 'dummy'};
    window.FB = buildFBMock();
  },
  teardown: function(){
    window.FB = originalFB;
    configuration.providers['facebook-connect'] = originalConfiguration;
    $.getScript = originalGetScript;
    Ember.run(container, 'destroy');
  }
});

test("Opens facebook connect session", function(){
  $.getScript = function(){
    window.fbAsyncInit();
  };
  Ember.run(function(){
    torii.open('facebook-connect').then(function(){
      ok(true, "Facebook connect opened");
    }, function(e){
      ok(false, "Facebook connect failed to open: " + e.message);
    });
  });
});

test("Returns the scopes granted when configured", function(){
  $.getScript = function(){
    window.fbAsyncInit();
  };
  configuration.providers['facebook-connect'].returnScopes = true;
  Ember.run(function(){
    torii.open('facebook-connect').then(function(data){
      equal('email', data.grantedScopes);
    });
  });
});

test("Supports custom auth_type on login", function(){
  $.getScript = function(){
    window.fbAsyncInit();
  };
  Ember.run(function(){
    torii.open('facebook-connect', {authType: 'rerequest'}).then(function(data){
      equal(5678, data.expiresIn, 'expriesIn extended when rerequest found');
    });
  });
});
