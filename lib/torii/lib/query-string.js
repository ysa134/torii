var camelize = Ember.String.camelize,
    get      = Ember.get;

function isDefined(value){
  return typeof value !== 'undefined';
}

function getParamValue(obj, paramName, optional){
  var camelizedName = camelize(paramName),
      value         = get(obj, camelizedName);

  if (!optional) {
    if ( !isDefined(value) && isDefined(get(obj, paramName))) {
      throw new Error(
        'Use camelized versions of url params. (Did not find ' +
        '"' + camelizedName + '" property but did find ' +
        '"' + paramName + '".');
    }

    if (!isDefined(value)) {
      throw new Error(
        'Missing url param: "'+paramName+'". (Looked for: property named "' +
        camelizedName + '".'
      );
    }
  }

  return isDefined(value) ? encodeURIComponent(value) : undefined;
}

function getOptionalParamValue(obj, paramName){
  return getParamValue(obj, paramName, true);
}

export default Ember.Object.extend({
  init: function(obj, urlParams, optionalUrlParams){
    this.obj               = obj;
    this.urlParams         = Ember.A(urlParams);
    this.optionalUrlParams = Ember.A(optionalUrlParams || []);
  },

  toString: function(){
    var urlParams         = this.urlParams,
        optionalUrlParams = this.optionalUrlParams,
        obj               = this.obj,
        keyValuePairs     = Ember.A([]);

    urlParams.forEach(function(paramName){
      var paramValue = getParamValue(obj, paramName);

      keyValuePairs.push( [paramName, paramValue] );
    });

    optionalUrlParams.forEach(function(paramName){
      var paramValue = getOptionalParamValue(obj, paramName);

      if (isDefined(paramValue)) {
        keyValuePairs.push( [paramName, paramValue] );
      }
    });

    return keyValuePairs.map(function(pair){
      return pair.join('=');
    }).join('&');
  }
});
