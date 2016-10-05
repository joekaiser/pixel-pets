angular.module('pixelPets', ['ui.router', 'ngNotificationsBar', 'ngSanitize', 'angularMoment'])

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

.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', 'notificationsConfigProvider',
    function($stateProvider, $urlRouterProvider, USER_ROLES, notificationsConfigProvider) {

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
                templateUrl: '/views/home/home.html',
                controller: 'homeController',
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

        notificationsConfigProvider.setAutoHide(false);
        notificationsConfigProvider.setAcceptHTML(true);
    }
])

.run(['$log', '$rootScope', '$transitions', '$http', 'AUTH_EVENTS', 'AuthService',
    function($log, $rootScope, $transitions, $http, AUTH_EVENTS, AuthService) {

        $http.defaults.headers.common['Accept'] = 'application/json, text/plain, * / *';
        $http.defaults.headers.post['Content-Type'] = 'application/json';
        $transitions.onBefore({
                to: function(state) {
                    return state.data && state.data.authorizedRole;
                }
            },
            function(transition) {
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

    }
])

.controller('ApplicationController', ['$log', '$rootScope', '$scope', '$state', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService', 'PetService', 'Session',
    function($log, $rootScope, $scope, $state, USER_ROLES, AUTH_EVENTS, AuthService, PetService, Session) {

        $scope.reloadUserPets = function() {
            PetService.getUserPets(Session.data().id)
                .then(function(res) {
                    $scope.pets = res.data;
                })
                .catch(function(err) {
                    $log.error(err);
                });
        };

        $scope.currentUser = null;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function(user) {
            $scope.currentUser = user;
            $log.info('setting logged in user to:');
            $log.info(user);
        };

        $scope.logout = function() {
            AuthService.logout();
            $scope.currentUser = null;
            $state.transitionTo('main');
        };

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
            $scope.reloadUserPets();
        });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
            $log.warn('not authenticated');
            $scope.logout();
        });

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function() {
            //show error message
            $log.warn('not authorized for previous service call');
        });

    }
]);