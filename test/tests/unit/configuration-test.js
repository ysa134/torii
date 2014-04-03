import configuration from 'torii/configuration';

var originalConfiguration = configuration.test;

module('Configuration - Unit', {
  setup: function(){},
  teardown: function(){
    configuration.test = originalConfiguration;
  }
});

test("it should throw when reading a value not configured", function(){
  var threw = false, message;
  try {
    configuration.read('bar.baz');
  } catch (e) {
    threw = true;
    message = e.message;
  }

  ok(threw, 'read threw');
  ok(/Expected configuration value bar.baz/.test(message), 'has proper error');
});

test("it should read values", function(){
  configuration.test = {item: 'item val'};
  var value = configuration.read('test.item');

  equal(value, 'item val');
});
