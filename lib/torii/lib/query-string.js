var camelize = Ember.String.camelize,
    get      = Ember.get;

function getParamValue(obj, paramName){
  var camelizedName = camelize(paramName),
      value         = get(obj, camelizedName);

  if (!value && get(obj, paramName)) {
    throw new Error(
      'Use camelized versions of url params. (Did not find ' +
      '"' + camelizedName + '" property but did find ' +
      '"' + paramName + '".');
  }

  if (!value) {
    throw new Error(
      'Missing url param: "'+paramName+'". (Looked for: property named "' +
      camelizedName + '".'
    );
  }

  return value;
}

export default Ember.Object.extend({
  init: function(obj, urlParams){
    this.obj       = obj;
    this.urlParams = urlParams;
  },

  toString: function(){
    var urlParams     = Ember.A(this.urlParams),
        obj           = this.obj,
        keyValuePairs = Ember.A([]);

    urlParams.forEach(function(paramName){
      var paramValue = getParamValue(obj, paramName);
      paramValue     = encodeURIComponent(paramValue);

      keyValuePairs.push( [paramName, paramValue] );
    });

    return keyValuePairs.map(function(pair){
      return pair.join('=');
    }).join('&');
  }
});
