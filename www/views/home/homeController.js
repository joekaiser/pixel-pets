angular.module('pixelPets').controller('homeController', ['$log', '$rootScope', '$scope', 'Session', 'notifications', 'PetService',
    function($log, $rootScope, $scope, Session, notifications, PetService) {

        PetService.getUserPets(Session.userId)
            .then(function(res) {
                var pets = res.data;
                
            })
            .catch(function(err) {
                $log.error(err);
            });


    }
]);