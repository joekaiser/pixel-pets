angular.module('pixelPets', ['ui.router'])

.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
    all: '*',
    admin: 'admin'
})

.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES',
function ($stateProvider, $urlRouterProvider, USER_ROLES) {

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('main', {
                url: '/',
                templateUrl: '/views/login/login.html',
                controller: 'loginController'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: '/views/app/app.html',
                data: {
                    authorizedRole: USER_ROLES.all
                }
            })
            .state('app.house', {
                url: '',
                template: 'house',
                data: {
                    authorizedRole: USER_ROLES.all
                }
            })
            .state('app.garden', {
                url: '/garden',
                template: 'garden',
                data: {
                    authorizedRole: USER_ROLES.all
                }
            })
            .state('app.store', {
                url: '/store',
                template: 'store',
                data: {
                    authorizedRole: USER_ROLES.all
                }
            })
            .state('app.playground', {
                url: '/playground',
                template: 'playground',
                data: {
                    authorizedRole: USER_ROLES.all
                }
            })
            .state('app.school', {
                url: '/school',
                template: 'school',
                data: {
                    authorizedRole: USER_ROLES.all
                }
            });



}])

.run(['$log', '$rootScope', '$transitions', 'AUTH_EVENTS', 'AuthService',
function ($log, $rootScope, $transitions, AUTH_EVENTS, AuthService) {

        $transitions.onBefore({
                to: function (state) {
                    return state.data && state.data.authorizedRole;
                }
            },
            function (transition) {
                var authorizedRole = transition.$to().data.authorizedRole;
                if (!AuthService.isAuthorized(authorizedRole)) {

                    if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $log.error('not authorized to view: ' + transition.$to().name);
                        return false;

                    } else {
                        // user is not logged in
                        $log.warn('not logged in');
                        return transition.router.stateService.target('main');
                    }
                }
            }
        );

}])

.controller('ApplicationController', ['$log', '$rootScope', '$scope', '$state', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService',
  function ($log, $rootScope, $scope, $state, USER_ROLES, AUTH_EVENTS, AuthService) {
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
            $log.info('setting logged in user to:');
            $log.info(user);
        };

        $scope.logout = function () {
            AuthService.logout();
            $scope.currentUser = null;
            $state.transitionTo('main');
        };

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            $log.warn('not authenticated');
            $scope.logout();
        });

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function () {
            //show error message
            $log.warn('not authorized for previous service call');
        });

  }
]);
