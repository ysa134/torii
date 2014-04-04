/**
 * This class implements authentication against an API
 * using the OAuth2 authorization flow in a popup window.
 */

import Endpoint from 'torii/endpoints/-base';
import Oauth2Authentication from 'torii/authentications/oauth2';
import {configurable} from 'torii/configuration';

var Oauth2 = Endpoint.extend({

  // Required settings:
  baseUrl: Ember.required(),
  apiKey:  configurable('apiKey'),

  // Optional settings:
  scope:   null,

  // API:
  //
  redirectUri: function(){
    return [window.location.protocol,
            "//",
            window.location.host,
            window.location.pathname].join('');
  }.property(),

  urlParams: function(){
    var params = [
      "response_type=code",
      "client_id="+this.get('apiKey'),
      "state=STATE",
      "redirect_uri="+this.get('redirectUri')
    ];
    if (this.get('scope')) {
      params.push('scope='+this.get('scope'));
    }
    return params.join('&');
  }.property('redirectUri'),

  url: function(){
    return this.get('baseUrl')+'?'+this.get('urlParams');
  }.property('baseUrl', 'urlParams'),

  open: function(){
    var name = this.get('name'),
        url  = this.get('url');
    return this.get('popup').open(url).then(function(authData){
      return Oauth2Authentication.create({
        authorizationCode: authData.authorizationCode,
        endpoint: name
      });
    });
  }

});

export default Oauth2;
