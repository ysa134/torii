/**
 * This class implements authentication against an API
 * using the OAuth2 authorization flow in a popup window.
 */

import Provider from 'torii/providers/base';
import {configurable} from 'torii/configuration';
import QueryString from 'torii/lib/query-string';
import requiredProperty from 'torii/lib/required-property';

function currentUrl(){
  return [window.location.protocol,
          "//",
          window.location.host,
          window.location.pathname].join('');
}

var Oauth2 = Provider.extend({
  concatenatedProperties: ['requiredUrlParams','optionalUrlParams'],

  // Default required url parameters.
  // Sub-classes can add additional ones
  requiredUrlParams: ['response_type', 'client_id', 'redirect_uri'],

  // Optional URL params can be added by sub-classes
  optionalUrlParams: ['scope'],

  // Required settings:
  baseUrl:      requiredProperty(),
  apiKey:       configurable('apiKey'),
  scope:        configurable('scope', null),
  clientId:     Ember.computed.alias('apiKey'),
  responseType: 'code',

  // {array} These parameters are required to be in the url parameters
  //         that the provider includes when it sends the user to the
  //         redirectUri. If these parameter(s) are not present, this
  //         is an indication that the user clicked a "cancel" button
  //         instead of an "okay" button.
  responseParams: requiredProperty(),

  // API:

  redirectUri: function(){
    return currentUrl();
  }.property(),

  buildQueryString: function(){
    var requiredParams = this.get('requiredUrlParams'),
        optionalParams = this.get('optionalUrlParams');

    var qs = new QueryString(this, requiredParams, optionalParams);
    return qs.toString();
  },

  buildUrl: function(){
    var base = this.get('baseUrl'),
        qs   = this.buildQueryString();

    return [base, qs].join('?');
  },

  open: function(){
    var name        = this.get('name'),
        url         = this.buildUrl(),
        redirectUri = this.get('redirectUri'),
        responseParams = this.get('responseParams');

    return this.get('popup').open(url, responseParams).then(function(authData){
      var missingResponseParams = [];

      responseParams.forEach(function(param){
        if (authData[param] === undefined) {
          missingResponseParams.push(param);
        }
      });

      if (missingResponseParams.length){
        throw "The response from the provider is missing " +
              "these required response params: " + responseParams.join(', ');
      }

      return {
        authorizationCode: authData.code,
        provider: name,
        redirectUri: redirectUri
      };
    });
  }

});

export default Oauth2;
