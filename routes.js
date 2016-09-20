var AuthController = App.require('modules/auth.js')
module.exports = function (app) {
    var HeartBeatController = App.require('controllers/heartbeatController.js');
    var UserController = App.require('controllers/userController.js');

    app.get("/", function (request, response) {
        response.sendFile(__dirname + '/www/index.html');
    });



    app.get('/heartbeat', AuthController.isAuthenticated, HeartBeatController.ping);
    app.post('/login', UserController.login);
    app.post('/register', UserController.register);


    App.app.use(function (err, req, res, next) {

        if (typeof err === 'object') {
            res.status(500).json(err);
        } else {
            res.status(500).json({
                message: err,
            });
        }
    })


};
