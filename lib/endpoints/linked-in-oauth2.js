/**
 * This class implements authentication against Linked In
 * using the OAuth2 authorizatin flow in a popup window.
 */
var LinkedInOauth2 = Ember.Object.extend({

  // This should become an injection
  popup: function(){
    return this.container.lookup('torii:popup');
  }.property(),

  // This should become an injection
  torii: function(){
    return this.container.lookup('torii:main');
  }.property(),

  apiKey: Ember.computed.alias('torii.options.linkedInOauth2.apiKey'),

  redirectUri: function(){
    return window.location.protocol+"//"+window.location.host;
  },

  baseUrl: function(){
    return "https://www.linkedin.com/uas/oauth2/authorization";
  },

  urlParams: function(){
    return [
      "response_type=code",
      "client_id="+this.get('apiKey'),
      // "scope=SCOPE",
      "state=STATE",
      "redirect_uri="+this.get('redirectUri')
    ].join('&');
  },

  url: function(){
    return this.get('baseUrl')+'?'+this.get('urlParams');
  },

  open: function(){
    return this.get('popup').open(this.get('url')).then(function(authData){
      return Oauth2Authentication.create({
        authorizationCode: authData.authorizationCode,
        endpoint: 'linked-in-oauth2'
      });
    });
  }

});

export default LinkedInOauth2;
