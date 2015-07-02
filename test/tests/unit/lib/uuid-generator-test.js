import UUIDGenerator from 'torii/lib/uuid-generator';

module('UUIDGenerator - Unit');

test('exists', function(){
  ok(UUIDGenerator);
});

test('.generate returns a new uuid each time', function(){
  var first = UUIDGenerator.generate();
  var second = UUIDGenerator.generate();

  notEqual(first, second);
});
