import configuration from 'torii/configuration';
import Session from 'torii/session';

export default {
  name: 'torii-session',
  after: 'torii',

  initialize: function(container, app){

    if (configuration.sessionServiceName) {
      var sessionName = configuration.sessionServiceName;
      app.register('torii:session', Session);
      app.inject('torii:session', 'torii', 'torii:main');
      app.inject('route',      sessionName, 'torii:session');
      app.inject('controller', sessionName, 'torii:session');
    }
  }
};
