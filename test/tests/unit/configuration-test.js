module configurationModule from 'torii/configuration';

var configuration = configurationModule.default,
    configurable  = configurationModule.configurable;

var originalConfiguration = configuration.test,
    Testable = Ember.Object.extend({
      configNamespace: 'test',
      required: configurable('apiKey'),
      defaulted: configurable('scope', 'email'),
      defaultedFunctionValue: 'found-via-get',
      defaultedFunction: configurable('redirectUri', function(){
        return this.get('defaultedFunctionValue');
      }),
    }),
    testable;

module('Configuration - Unit', {
  setup: function(){
    testable = new Testable();
  },
  teardown: function(){
    configuration.test = originalConfiguration;
    Ember.run(testable, 'destroy');
  }
});

test("it should throw when reading a value not defaulted", function(){
  var threw = false, message;
  try {
    testable.get('required');
  } catch (e) {
    threw = true;
    message = e.message;
  }

  ok(threw, 'read threw');
  ok(/Expected configuration value test.apiKey/.test(message), 'did not have proper error: '+message);
});

test("it should read values", function(){
  configuration.test = {apiKey: 'item val'};
  var value = testable.get('required');
  equal(value, 'item val');
});

test("it should read default values", function(){
  var value = testable.get('defaulted');
  equal(value, 'email');
});

test("it should override default values", function(){
  configuration.test = {scope: 'baz'};
  var value = testable.get('defaulted');
  equal(value, 'baz');
});

test("it read default values from a function", function(){
  var value = testable.get('defaultedFunction');
  equal(value, 'found-via-get');
});
