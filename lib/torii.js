function lookupEndpoint(container, endpointName){
  return container.lookup('torii-endpoint:'+endpointName);
}

function generateProxyToEndpoint(methodName){
  return function proxyToEndpoint(endpointName, options){
    var endpoint = lookupEndpoint(this.container, endpointName);
    if (!endpoint) {
      throw new Error("Expected an endpoint named "+endpointName+", did you forget to register it?");
    }
    return endpoint[methodName](options);
  }
}

/**
 * Torii is an engine for authenticating against various
 * endpoints. For example, you can open a session with
 * Linked In via Oauth2 and authorization codes by doing
 * the following:
 *
 *     Torii.open('linked-in-oauth2').then(function(authData){
 *       console.log(authData.authorizationCode);
 *     });
 *
 * For traditional authentication flows, you will often use
 * Torii via the Torii.Session API.
 *
 * @class Torii
 */
var Torii = Ember.Object.extend({

  /**
   * Open an authorization against an API. A promise resolving
   * with an authentication response object is returned. These
   * response objects,  are found in the "torii/authentications"
   * namespace.
   *
   * @method open
   * @param {String} endpointName The endpoint to open
   * @return {Ember.RSVP.Promise} Promise resolving to an authentication object
   */
  open:  generateProxyToEndpoint('open'),

  /**
   * Return a promise which will resolve if the endpoint has
   * already been opened. This may be async.
   *
   * @method fetch
   * @param {String} endpointName The endpoint to open
   * @return {Ember.RSVP.Promise} Promise resolving to an authentication object
   */
  fetch: generateProxyToEndpoint('fetch'),

  /**
   * Return a promise which will resolve when the endpoing has
   * been closed. Closing an endpoint may not always be a
   * meaningful action.
   *
   * @method close
   * @param {String} endpointName The endpoint to close
   * @return {Ember.RSVP.Promise} Promise resolving to an authentication object
   */
  close: generateProxyToEndpoint('close')
});

export default Torii;
