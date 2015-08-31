import ToriiSessionService from 'torii/services/torii-session';

export default function(container, sessionName){
  var sessionFactoryName = 'service:' + sessionName;
  container.register(sessionFactoryName, ToriiSessionService);
  container.injection(sessionFactoryName, 'torii', 'service:torii');
  container.injection('route',      sessionName, sessionFactoryName);
  container.injection('controller', sessionName, sessionFactoryName);

  return container;
}
