/* global Ember */

import ParseQueryString from 'torii/lib/parse-query-string';

module('ParseQueryString - Unit');

test('parses each passed key', function(){
  var url = 'http://localhost.dev:3000/xyz/?code=abcdef';
  var parser = new ParseQueryString(url, ['code']);

  var result = parser.parse();
  ok(result.code, 'gets code');
  equal(result.code, 'abcdef', 'gets correct code');
});

test('parses keys without the hash fragment', function(){
  var url = 'http://localhost.dev:3000/xyz/?code=abcdef#notCode=other';
  var parser = new ParseQueryString(url, ['code']);

  var result = parser.parse();
  ok(result.code, 'gets code');
  equal(result.code, 'abcdef', 'gets correct code');
});
