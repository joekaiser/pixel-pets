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

        var getPets = function() {
            PetService.getUserPets(Session.data().id)
                .then(function(res) {
                    $scope.pets = res.data;
                })
                .catch(function(err) {
                    $log.error(err);
                });
        };

        $scope.hatch = function(id) {
            PetService.hatchEgg(id, Session.data().id)
                .then(function(res) {
                    getEggs();
                    getPets();
                }).catch(function(err) {
                    $log.error(err);
                })
        };


        (function constructor() {
            getEggs();
            getPets();
        })();

    }
]);