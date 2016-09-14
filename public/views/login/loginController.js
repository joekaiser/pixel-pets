angular.module('pixelPets').controller('loginController', 
['$rootScope','$scope','$state','AUTH_EVENTS','AuthService', function($rootScope, $scope, $state, AUTH_EVENTS,AuthService) {
  
  $scope.signin=function(){
    // AuthService.login(credentials).then(function (user) {
    //   $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    //   $scope.setCurrentUser(user);
    // }, function () {
    //   $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    // });
    var fakeUser = AuthService.login();
    $scope.setCurrentUser(fakeUser);
    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    $state.transitionTo('app');
  };
  
}]);