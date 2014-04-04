export default function(){
  return {
    init: function(){},
    login: function(callback){
      callback({
        authResponse: 1234,
        status: 567
      });
    }
  };
};
