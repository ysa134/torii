import {configurable} from 'torii/configuration';
import Oauth2 from 'torii/endpoints/-oauth2-code';

export default Oauth2.extend({
  name:    'facebook-oauth2',
  baseUrl: 'https://www.facebook.com/dialog/oauth',

  // Additional url params that this endpoint requires
  requiredUrlParams: ['display'],

  scope:        configurable('scope', 'email'),

  display: 'popup',
  redirectUri: configurable('redirectUri', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  })
});
