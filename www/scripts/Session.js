angular.module('pixelPets').service('Session', function() {



    var data = { token: null, id: null, roles: null, username: null };

    this.loadFromCache = function() {
        data = lscache.get('session');
        return check.assigned(data);
    }


    this.create = function(user) {
        data = user;

        lscache.set('session', data);

    };
    this.destroy = function() {
        data = {};
        lscache.remove('session');
    };

    this.data = function() {
        if (!check.assigned(data)) data = {};
        return data;
    }
});