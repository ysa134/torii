import {configurable} from 'torii/configuration';
import Oauth2 from 'torii/endpoints/-oauth2-code';

export default Oauth2.extend({
  name:    'facebook-oauth2',
  baseUrl: 'https://www.facebook.com/dialog/oauth',

  redirectUri: configurable('redirectUri', 'http://localhost:8000/example')
});
