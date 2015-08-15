import configuration from 'torii/configuration';
import bootstrapSession from 'torii/bootstrap/session';

export default {
  name: 'torii-session',
  after: 'torii',

  initialize: function(container){
    if (configuration.sessionServiceName) {
      bootstrapSession(container, configuration.sessionServiceName);

      var sessionFactoryName = 'service:' + configuration.sessionServiceName;
      container.injection('adapter', configuration.sessionServiceName, sessionFactoryName);
    }
  }
};
