function lookupProvider(container, providerName){
  return container.lookup('torii-provider:'+providerName);
}

function generateProxyToProvider(methodName){
  return function proxyToProvider(providerName, options){
    var provider = lookupProvider(this.container, providerName);
    if (!provider) {
      throw new Error("Expected an provider named "+providerName+", did you forget to register it?");
    }
    return provider[methodName](options);
  }
}

/**
 * Torii is an engine for authenticating against various
 * providers. For example, you can open a session with
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
   * @param {String} providerName The provider to open
   * @return {Ember.RSVP.Promise} Promise resolving to an authentication object
   */
  open:  generateProxyToProvider('open'),

  /**
   * Return a promise which will resolve if the provider has
   * already been opened. This may be async.
   *
   * @method fetch
   * @param {String} providerName The provider to open
   * @return {Ember.RSVP.Promise} Promise resolving to an authentication object
   */
  fetch: generateProxyToProvider('fetch'),

  /**
   * Return a promise which will resolve when the endpoing has
   * been closed. Closing an provider may not always be a
   * meaningful action.
   *
   * @method close
   * @param {String} providerName The provider to close
   * @return {Ember.RSVP.Promise} Promise resolving to an authentication object
   */
  close: generateProxyToProvider('close')
});

export default Torii;
