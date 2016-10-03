var AuthController = App.require('modules/auth.js')
module.exports = function(app) {
    var HeartBeatController = App.require('controllers/heartbeatController.js');
    var UserController = App.require('controllers/userController.js');
    var PetController = App.require('controllers/petController.js');

    app.get("/", function(request, response) {
        response.sendFile(__dirname + '/www/index.html');
    });



    app.get('/heartbeat', AuthController.isAuthenticated, HeartBeatController.ping);

    app.post('/login', UserController.login);
    app.post('/register', UserController.register);
    app.get('/user/notes', AuthController.isAuthenticated, UserController.notifications);

    app.post('/pets/systemPet', AuthController.isAuthenticated, PetController.addSystemPet);
    app.get('/pets/userpets', AuthController.isAuthenticated, PetController.getUsersPets);
    app.get('/pets/usereggs', AuthController.isAuthenticated, PetController.getUsersEggs);
    app.post('/pets/hatch', AuthController.isAuthenticated, PetController.hatchEgg);
    app.post('/pets/giveegg', AuthController.isAuthenticated, PetController.giveEgg);

    App.app.use(function(err, req, res, next) {
        res.status(500).json({
            message: err,
        });
    })


};