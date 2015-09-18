/* global Ember */

import ParseQueryString from 'torii/lib/parse-query-string';

module('ParseQueryString - Unit');

test('parses each passed key', function(){
  var url = 'http://localhost.dev:3000/xyz/?code=abcdef';
  var parser = ParseQueryString.create({url: url, keys: ['code']});

  var result = parser.parse();
  ok(result.code, 'gets code');
  equal(result.code, 'abcdef', 'gets correct code');
});

test('parses keys without the hash fragment', function(){
  var url = 'http://localhost.dev:3000/xyz/?code=abcdef#notCode=other';
  var parser = ParseQueryString.create({url: url, keys: ['code']});

  var result = parser.parse();
  ok(result.code, 'gets code');
  equal(result.code, 'abcdef', 'gets correct code');
});

test('parses multiple keys', function(){
  var url = 'http://localhost.dev:3000/xyz/?oauth_token=xxx&oauth_verifier=yyy';
  var parser = ParseQueryString.create({url: url, keys: ['oauth_token','oauth_verifier']});

  var result = parser.parse();
  ok(result.oauth_token, 'gets token');
  ok(result.oauth_verifier, 'gets verifier');
  equal(result.oauth_token, 'xxx', 'gets correct token');
  equal(result.oauth_verifier, 'yyy', 'gets correct verifier');
});
