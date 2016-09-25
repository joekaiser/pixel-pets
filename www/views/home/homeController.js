angular.module('pixelPets').controller('homeController', ['$log', '$rootScope', '$scope', 'Session', 'notifications', 'PetService',
    function($log, $rootScope, $scope, Session, notifications, PetService) {



        PetService.getUserEggs(Session.data().id)
            .then(function(res) {
                $scope.eggs = res.data;

            })
            .catch(function(err) {
                $log.error(err);
            });


    }
]);