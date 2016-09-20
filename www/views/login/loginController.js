angular.module('pixelPets').controller('loginController', ['$rootScope', '$scope', '$state', 'AUTH_EVENTS', 'AuthService', 'Session', function ($rootScope, $scope, $state, AUTH_EVENTS, AuthService, Session) {

    $scope.signin = function () {

        AuthService.login($scope.username, $scope.password).then(function (res) {
            Session.create(res.data.token, res.data.id, res.data.roles);
            $scope.setCurrentUser(res.data);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $state.transitionTo('app.house');
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

}]);
