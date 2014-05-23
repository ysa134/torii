/**
 * This class implements authentication against Linked In
 * using the OAuth2 authorization flow in a popup window.
 */

import Oauth2 from 'torii/endpoints/oauth2-code';
import {configurable} from 'torii/configuration';

var LinkedInOauth2 = Oauth2.extend({
  name:       'linked-in-oauth2',
  baseUrl:    'https://www.linkedin.com/uas/oauth2/authorization',

  // additional url params that this endpoint requires
  requiredUrlParams: ['state'],

  state: 'STATE',

  redirectUri: configurable('redirectUri', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  })

});

export default LinkedInOauth2;
