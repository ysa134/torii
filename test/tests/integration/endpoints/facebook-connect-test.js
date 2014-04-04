var torii, container;

import buildFBMock from 'test/helpers/build-fb-mock';
import toriiContainer from 'test/helpers/torii-container';
import configuration from 'torii/configuration';

var originalConfiguration = configuration.endpoints['facebook-connect'],
    originalGetScript = $.getScript,
    originalFB = window.FB;

module('Facebook Connect - Integration', {
  setup: function(){
    container = toriiContainer();
    torii = container.lookup('torii:main');
    configuration.endpoints['facebook-connect'] = {appId: 'dummy'};
    window.FB = buildFBMock();
  },
  teardown: function(){
    window.FB = originalFB;
    configuration.endpoints['facebook-connect'] = originalConfiguration;
    $.getScript = originalGetScript;
    Ember.run(container, 'destroy');
  }
});

test("Opens facebook connect session", function(){
  $.getScript = function(){
    window.fbAsyncInit();
  }
  Ember.run(function(){
    torii.open('facebook-connect').then(function(){
      ok(true, "Facebook connect opened");
    }, function(){
      ok(false, "Facebook connect failed to open");
    });
  });
});
