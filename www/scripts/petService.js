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

    service.hatchEgg = function(eggId, uid) {
        return $http.post('/pets/hatch', {
            "id": eggId,
            "userId": uid
        });
    };

    service.setActive = function(petId, uid) {
        return $http.post('/pets/setActive', {
            "petId": petId,
            "userId": uid
        });
    }

    return service;
}]);