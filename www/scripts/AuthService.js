angular.module('pixelPets').factory('AuthService', ['$http','Session',function ($http, Session) {
  var authService = {};
 
  authService.login = function (credentials) {
    // return $http
    //   .post('/login', credentials)
    //   .then(function (res) {
    //     Session.create(res.data.id, res.data.user.id,
    //                   res.data.user.role);
    //     return res.data.user;
    //   });
    
    var fakeUser = {
      name:'player1',
      id:1,
      role:['*','admin']
    };
    
    var sessionId='12345678';
    Session.create(sessionId, fakeUser.id, fakeUser.role);
    return fakeUser;
  };
 
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
  authService.isAuthorized = function (authorizedRole) {
    
    return (authService.isAuthenticated() &&
      Session.userRole.indexOf(authorizedRole) !==-1);
    };
  
  authService.logout = function(){
    //make a request to kill the session token
    Session.destroy();
  }
 
  return authService;
}]);