import Torii from 'torii';
import LinkedInOauth2Endpoint from 'torii/endpoints/linked-in-oauth2';
import ApplicationAdapter from 'torii/adapters/application';

import PopupService from 'torii/services/popup';

export default function(container){
  container.register('torii:main', Torii);
  container.register('torii-endpoint:linked-in-oauth2', LinkedInOauth2Endpoint);
  container.register('torii-adapter:application', ApplicationAdapter);

  container.register('torii-service:popup', PopupService);

  container.injection('torii-endpoint', 'popup', 'torii-service:popup');
};
