var AuthController = App.require('modules/auth.js')
module.exports = function (app) {
    var HeartBeatController = App.require('controllers/heartbeatController.js');
    var UserController = App.require('controllers/userController.js');
    var PetController = App.require('controllers/petController.js');

    app.get("/", function (request, response) {
        response.sendFile(__dirname + '/www/index.html');
    });



    app.get('/heartbeat', AuthController.isAuthenticated, HeartBeatController.ping);
    app.post('/login', UserController.login);
    app.post('/register', UserController.register);


    app.post('/pets/systemPet', PetController.addSystemPet);


    App.app.use(function (err, req, res, next) {
        res.status(500).json({
            message: err,
        });
    })


};
