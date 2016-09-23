angular.module('pixelPets').factory('PetService', ['$http', function ($http) {
    var service = {};

    service.getUserPets = function (uid) {
        return $http.post('/pets/userpets', {
            "userId":uid
        });
    };

    return service;
}]);
