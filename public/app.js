
var app = angular.module('pixelPets', ['ui.router']);

app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
  all: '*',
  admin: 'admin'
});

app.config(['$stateProvider','$urlRouterProvider','USER_ROLES', 
function($stateProvider, $urlRouterProvider, USER_ROLES) {
  
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('main',{
    url: '/',
    templateUrl:'/views/login/login.html',
    controller:'loginController'
  });
  
  $stateProvider.state('app',{
    url: '/app',
    template:'<p>welcome</p>',
    data:{
      authorizedRole:USER_ROLES.all
    }
  });

}]);

app.run(['$log','$rootScope','$transitions','AUTH_EVENTS','AuthService',
function ($log,$rootScope,$transitions, AUTH_EVENTS, AuthService) {

  $transitions.onBefore(
    {to:function(state){
      return state.data && state.data.authorizedRole;
    }},
    function(transition){
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
  
}]);

app.controller('ApplicationController', ['$log','$rootScope','$scope','$state','USER_ROLES','AUTH_EVENTS','AuthService',
  function($log,$rootScope, $scope,$state,USER_ROLES,AUTH_EVENTS,AuthService){
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
   
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
      $log.info('setting logged in user to:');
      $log.info(user);
    };
   
   $scope.logout = function(){
     AuthService.logout();
     $scope.currentUser=null;
     $state.transitionTo('main');
   };

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(){
      $log.warn('not authenticated');
      $scope.logout();
   });
   
   $rootScope.$on(AUTH_EVENTS.notAuthorized, function(){
      //show error message
      $log.warn('not authorized for previous service call');
   });
   
  }
]);