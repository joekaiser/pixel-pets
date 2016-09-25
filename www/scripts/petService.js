angular.module('pixelPets').factory('PetService', ['$http', function($http) {
    var service = {};

    service.getUserPets = function(uid) {
        return $http.get('/pets/userpets', {
            params: {
                "userId": uid
            }
        });
    };

    service.getUserEggs = function(uid) {
        return $http.get('/pets/usereggs', {
            params: {
                "userId": uid
            }
        });
    };

    return service;
}]);