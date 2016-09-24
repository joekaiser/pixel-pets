angular.module('pixelPets').controller('loginController', ['$rootScope', '$scope', '$state', '$http', 'AUTH_EVENTS', 'AuthService', 'Session',
    function($rootScope, $scope, $state, $http, AUTH_EVENTS, AuthService, Session) {




        var loginUser = function() {

            if (Session.loadFromCache()) {
                $http.defaults.headers.common['Authorization'] = 'bearer ' + Session.data().token;
                $scope.setCurrentUser(Session.data());
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $state.transitionTo('app.house');
            }
        }

        $scope.signin = function() {

            AuthService.login($scope.username, $scope.password).then(function(res) {
                $scope.loginError = undefined;
                Session.create(res.data);
                loginUser();
            }, function(err) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                if (err.status === 401) {
                    $scope.loginError = "The password was wrong";
                } else {
                    $scope.loginError = "Login Failed. Please try again later";
                }
            });
        };

        (function constructor() {
            loginUser();
        })();
    }
]);