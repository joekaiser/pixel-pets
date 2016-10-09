angular.module('pixelPets').controller('homeController', ['$log', '$rootScope', '$scope', 'Session', 'notifications', 'PetService',
    function($log, $rootScope, $scope, Session, notifications, PetService) {


        var getEggs = function() {
            PetService.getUserEggs(Session.data().id)
                .then(function(res) {
                    $scope.eggs = res.data.length === 0 ? null : res.data;

                })
                .catch(function(err) {
                    $log.error(err);
                });
        };



        $scope.hatch = function(id) {
            PetService.hatchEgg(id, Session.data().id)
                .then(function(res) {
                    getEggs();
                    $scope.reloadUserPets();
                }).catch(function(err) {
                    $log.error(err);
                })
        };

        $scope.isPetAssigned = function() {
            if (!check.assigned($scope.pets)) {
                return true; //shortcutting this out because we don't show the message if there are no pets
            }


            return !($scope.pets.length > 0 && check.assigned(Session.data().active_pet));
        };

        $scope.setActivePet = function(petId) {
            Session.data().active_pet = petId;


            PetService.setActive(petId, Session.data().id)
                .then(function(res) {
                    Session.save();
                })
                .catch($log.error);
        };


        (function constructor() {
            getEggs();
        })();

    }
]);