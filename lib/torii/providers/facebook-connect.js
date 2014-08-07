/* global FB, $ */

/**
 * This class implements authentication against facebook
 * connect using the Facebook SDK.
 */

import Provider from 'torii/providers/base';
import {configurable} from 'torii/configuration';

var fbPromise;

function fbLoad(settings){
  if (fbPromise) { return fbPromise; }

  var original = window.fbAsyncInit;
  fbPromise = new Ember.RSVP.Promise(function(resolve, reject){
    window.fbAsyncInit = function(){
      FB.init(settings);
      Ember.run(null, resolve);
    };
    $.getScript('//connect.facebook.net/en_US/all.js');
  }).then(function(){
    window.fbAsyncInit = original;
  });

  return fbPromise;
}

function fbLogin(scope){
  return new Ember.RSVP.Promise(function(resolve, reject){
    FB.login(function(response){
      if (response.authResponse) {
        Ember.run(null, resolve, response.authResponse);
      } else {
        Ember.run(null, reject, response.status);
      }
    }, { scope: scope });
  });
}

function fbNormalize(response){
  return {
    userId: response.userID,
    accessToken: response.accessToken
  };
}

var Facebook = Provider.extend({

  // Required settings:
  name:  'facebook-connect',
  scope: configurable('scope', 'email'),
  appId: configurable('appId'),

  // API:
  //
  open: function(){
    return fbLoad( this.settings() )
      .then(fbLogin(this.get('scope')))
      .then(fbNormalize);
  },

  settings: function(){
    return {
      status: true,
      cookie: true,
      xfbml: false,
      appId: this.get('appId')
    };
  },

  // Load Facebook's script eagerly, so that the window.open
  // in FB.login will be part of the same JS frame as the
  // click itself.
  loadFbLogin: function(){
    fbLoad( this.settings() );
  }.on('init')

});

export default Facebook;
