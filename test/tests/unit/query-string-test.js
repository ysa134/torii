/* global Ember */

import QueryString from 'torii/lib/query-string';

var obj,
    clientId = 'abcdef',
    responseType = 'code',
    redirectUri = 'http://localhost.dev:3000/xyz/pdq';

module('QueryString - Unit', {
  setup: function(){
    obj = Ember.Object.create({
      clientId: clientId,
      responseType: responseType,
      redirectUri: redirectUri,
      additional_param: 'not-camelized'
    });
  }
});

test('looks up properties by camelized name', function(){
  var qs = new QueryString(obj, ['client_id']);

  equal(qs.toString(), 'client_id='+clientId,
        'sets client_id from clientId property');
});

test('joins properties with "&"', function(){
  var qs = new QueryString(obj, ['client_id','response_type']);

  equal(qs.toString(),
        'client_id='+clientId+'&response_type='+responseType,
        'joins client_id and response_type');
});

test('url encodes values', function(){
  var qs = new QueryString(obj, ['redirect_uri']);

  equal(qs.toString(),
        'redirect_uri=http%3A%2F%2Flocalhost.dev%3A3000%2Fxyz%2Fpdq',
        'encodes uri components');
});

test('throws error if property exists as non-camelized form', function(){
  var qs = new QueryString(obj, ['additional_param']);

  throws(function(){
    qs.toString();
  }, /camelized versions of url params/,
     'throws error when the non-camelized property name exists');
});

test('throws error if property does not exist', function(){
  var qs = new QueryString(obj, ['nonexistent_property']);

  throws(function(){
    qs.toString();
  }, /Missing url param.*nonexistent_property/,
     'throws error when property does not exist');
});
