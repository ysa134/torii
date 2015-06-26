import RedirectHandler from 'torii/redirect-handler';

export default {
  name: 'torii-callback',
  before: 'torii',
  initialize: function(container, app){
    app.deferReadiness();
    RedirectHandler.handle(window).catch(function(){
      app.advanceReadiness();
    });
  }
};
