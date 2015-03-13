import Oauth2 from 'torii/providers/oauth2-code';
import {configurable} from 'torii/configuration';

export default Oauth2.extend({
  name:       'stripe-connect',
  baseUrl:    'https://connect.stripe.com/oauth/authorize',

  // additional url params that this provider requires
  requiredUrlParams: [],

  responseParams: ['code'],

  scope: 'read_write',

  redirectUri: configurable('redirectUri', function() {
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  })
});
