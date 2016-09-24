angular.module('pixelPets').factory('AuthService', ['$http', 'Session', function($http, Session) {
    var authService = {};

    authService.login = function(usr, pw) {
        return $http.post('/login', {
            "username": usr,
            "password": pw
        });
    };

    authService.isAuthenticated = function() {
        return !!Session.data().id;
    };

    authService.isAuthorized = function(authorizedRole) {

        return (authService.isAuthenticated() &&
            Session.data().roles.indexOf(authorizedRole) !== -1);
    };

    authService.logout = function() {
        //make a request to kill the session token
        Session.destroy();
    };

    return authService;
}]);