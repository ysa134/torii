/**
 * This class implements authentication against google
 * using the OAuth2 authorization flow in a popup window.
 */

import Oauth2 from 'torii/endpoints/oauth2-code';
import {configurable} from 'torii/configuration';

var GoogleOauth2 = Oauth2.extend({

  name:       'google-oauth2',
  baseUrl:    'https://accounts.google.com/o/oauth2/auth',

  // additional params that this endpoint requires
  requiredUrlParams:   ['state'],

  scope:        configurable('scope', 'email'),

  state: 'STATE',

  redirectUri: configurable('redirectUri',
                            'http://localhost:8000/oauth2callback')
});

export default GoogleOauth2;
