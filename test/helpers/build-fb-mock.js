export default function(){
  return {
    init: function(){},
    login: function(callback, options){
      var authResponse = { expiresIn: 1234 };
      if (options.return_scopes == true) authResponse.grantedScopes = 'email';
      callback({
        authResponse: authResponse,
        status: 567
      });
    }
  };
};
