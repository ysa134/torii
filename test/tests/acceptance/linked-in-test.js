var torii, app, session;

module('Linked In - Acceptance', {
  setup: function(){
    app = startApp();
    var container = app.__container__;
    torii = container.lookup("torii:main");
    session = container.lookup("torii:session");
  },
  teardown: function(){

  }
});

test("Opens a popup to Linked In", function(){
  torii.open('linked-in-oauth2');
});

test("Opens a popup to Linked In", function(){
  session.open("linked-in-oauth2");
  equal(session.isOpening, true);
});
