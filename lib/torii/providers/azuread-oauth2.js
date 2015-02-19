import Oauth2 from 'torii/providers/oauth2-code';
import {configurable} from 'torii/configuration';

/**
 * This class implements authentication against AzureAD
 * using the OAuth2 authorization flow in a popup window.
 * @class
 */
var AzureAdOauth2 = Oauth2.extend({
  name: 'azuread-oauth2',

  baseUrl: function() {
    return 'https://login.windows.net/' + this.get('tennantId') + '/oauth2/authorize';
  }.property(),

  tennantId: configurable('tennantId', 'common'),

  // additional url params that this provider requires
  requiredUrlParams: ['state', 'api-version', 'client_id'],

  responseParams: ['code'],

  state: 'STATE',

  apiVersion: '1.0',

  redirectUri: configurable('redirectUri', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  })
});

export default AzureAdOauth2;
