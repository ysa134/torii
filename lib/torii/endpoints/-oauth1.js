/*
 * This class implements authentication against an API
 * using the OAuth1.0a request token flow in a popup window.
 */

import Endpoint from 'torii/endpoints/-base';
import {configurable} from 'torii/configuration';
import QueryString from 'torii/lib/query-string';
import requiredProperty from 'torii/lib/required-property';
import Oauth1Authentication from 'torii/authentications/oauth1';

function currentUrl(){
  return [window.location.protocol,
          "//",
          window.location.host,
          window.location.pathname].join('');
}

var Oauth1 = Endpoint.extend({
  name: '-oauth1',

  requestTokenUri: configurable('requestTokenUri'),

  buildRequestTokenUrl: function(){
    var requestTokenUri = this.get('requestTokenUri');
    return requestTokenUri;
  },

  open: function(){
    var name        = this.get('name'),
        url         = this.buildRequestTokenUrl();

    return this.get('popup').open(url).then(function(authData){
      authData.endpoint = name;
      return Oauth1Authentication.create(authData);
    });
  }
});

export default Oauth1;
