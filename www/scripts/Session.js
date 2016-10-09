angular.module('pixelPets').service('Session', function() {



    var data = { token: null, id: null, roles: null, username: null };

    this.loadFromCache = function() {
        data = lscache.get('session');
        return check.assigned(data);
    }

    this.save = function() {
        lscache.set('session', data);
    };


    this.create = function(user) {
        data = user;

        this.save();

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