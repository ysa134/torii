import bootstrapTorii from 'torii/bootstrap/torii';
import configuration from 'torii/configuration';

var initializer = {
  name: 'torii',
  initialize: function(container, app){
    bootstrapTorii(container);
    app.inject('route', 'torii', 'torii:main');
  }
};

if (window.DS) {
  initializer.after = 'store';
}

export default initializer;
