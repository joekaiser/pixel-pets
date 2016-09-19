var AuthController = App.require('modules/auth.js')
module.exports = function (app) {
    var HeartBeatController = App.require('controllers/heartbeatController.js');
    var UserController = App.require('controllers/userController.js');

    app.get("/", function (request, response) {
        response.sendFile(__dirname + '/www/index.html');
    });



    app.get('/heartbeat', AuthController.isAuthenticated, HeartBeatController.ping);
    app.get('/login', UserController.getUser);
    app.post('/register', UserController.register);


};
