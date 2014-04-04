/**
 * This class implements authentication against facebook
 * connect using the Facebook SDK.
 */

import Endpoint from 'torii/endpoints/-base';
import {configurable} from 'torii/configuration';
import Authentication from 'torii/authentications/facebook';

var fbPromise,
    settings = {
      status: true,
      cookie: true,
      xfbml: false
    };

function fbLoad(){
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

function fbLogin(){
  return new Ember.RSVP.Promise(function(resolve, reject){
    FB.login(function(response){
      if (response.authResponse) {
        resolve(response.authResponse);
      } else {
        reject(response.status);
      }
    });
  });
}

function fbNormalize(response){
  return Authentication.create({
    userId: response.userID,
    accessToken: response.accessToken
  });
}

var Facebook = Endpoint.extend({

  // Required settings:
  name:  'facebook-connect',
  scope: configurable('scope', 'email'),

  // API:
  //
  open: function(){
    return fbLoad()
      .then(fbLogin)
      .then(fbNormalize);
  }
});

export default Facebook;
