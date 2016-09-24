angular.module('pixelPets').factory('PetService', ['$http', function($http) {
    var service = {};

    service.getUserPets = function(uid) {
        return $http.get('/pets/userpets', {
            params: {
                "userId": uid
            }
        });
    };

    return service;
}]);