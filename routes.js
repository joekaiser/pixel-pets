module.exports = function (app) {
    var HeartBeatController = App.require('controllers/heartbeatController.js');

    app.get("/", function (request, response) {
        response.sendFile(__dirname + '/www/index.html');
    });



    app.get('/heartbeat', HeartBeatController.ping);

};
