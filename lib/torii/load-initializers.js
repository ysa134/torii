import loadInitializer from 'torii/lib/load-initializer';
import initializeTorii from 'torii/initializers/initialize-torii';
import initializeToriiCallback from 'torii/initializers/initialize-torii-callback';
import initializeToriiSession from 'torii/initializers/initialize-torii-session';

export default function(){
  loadInitializer(initializeToriiCallback);
  loadInitializer(initializeTorii);
  loadInitializer(initializeToriiSession);
}
