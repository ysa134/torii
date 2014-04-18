torii
=====

A set of clean abstractions for authentication in Ember.js

<img src="https://assets-vestorly.s3.amazonaws.com/assets/vestorly-logo-new-8c1ab7b52a5d1e26cdaa83bb8b63a42d.png" height="140" />

*Initial development of Torii was generously funded by [Vestorly](https://www.vestorly.com/). Vestorly is a technology company solving the client acquisition problem for professionals in wealth management, and the enterprises that support them. Vestorly's user interface is built entirely with Ember.js and modern web technologies. [jobs@vestorly.com](jobs@vestorly.com)*

## Generate docs

Use [YUIDoc](http://yui.github.io/yuidoc/).

  * Install: `npm install -g yuidocjs`
  * Generate: `yuidoc lib/`
  * Output will be put into "docs/"

## Run the example app

  * Start the server: `grunt server`
  * open [http://localhost:8000/example](http://localhost:8000/example)

## Supported Authentication Endpoints

  * LinkedIn OAuth2 ([Dev Site](https://www.linkedin.com/secure/developer) | [Docs](http://developer.linkedin.com/))
  * Google OAuth2 ([Dev Site](https://console.developers.google.com/project) | [Docs](https://developers.google.com/accounts/docs/OAuth2WebServer))
  * Facebook Connect (via FB SDK) ([Dev Site](https://developers.facebook.com/) | [Docs](https://developers.facebook.com/docs/)
  * Facebook OAuth2 ([Dev Site](https://developers.facebook.com/) | [Docs](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/)

## Semi-supported Authentication Endpoints

  * Twitter's OAuth 1.0a login can be supported with the popop service. Steps in
    the flow would be 1) Torii opens a popup to the app server asking for Twitter
    OAuth login 2) Server redirects to Twitter with the credentials for login
    3) User enters their credentials 4) Twitter redirects to app server which
    completes the authentication 5) Server loads the Ember application there or
    otherwise and transmits a message back to the parent window. 6) Ember application
    in the initial window closes the popup and resolves its endpoint promise.
