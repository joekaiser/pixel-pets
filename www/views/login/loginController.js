angular.module('pixelPets').controller('loginController', ['$rootScope', '$scope', '$state', 'AUTH_EVENTS', 'AuthService', 'Session', function ($rootScope, $scope, $state, AUTH_EVENTS, AuthService, Session) {

    $scope.signin = function () {

        AuthService.login($scope.username, $scope.password).then(function (res) {
            $scope.loginError = undefined;
            Session.create(res.data.token, res.data.id, res.data.roles);
            $scope.setCurrentUser(res.data);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $state.transitionTo('app.house');
        }, function (err) {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            if (err.status === 401) {
                $scope.loginError = "The password was wrong";
            } else {
                $scope.loginError = "Login Failed. Please try again later";
            }
        });
    };

}]);
