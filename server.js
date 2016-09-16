//// server.js
//// where your node app starts
//
//// init project
//var express = require('express');
//var app = express();
//
//
//app.use(express.static('www'));
//
//// listen for requests :)
//var listener = app.listen(process.env.NODE_PORT || 3000, function () {
//    console.log('Your app is listening on port ' + listener.address().port);
//});


var env = process.env.NODE_ENV || 'development';
var express = require('express');
var packageJson = require('./package.json');
var logger = require('./logging.js');

logger.log('info', 'Loading Pixel Pets in %s mode', env);

global.App = {
    app: express(),
    config: require('./config')[env],
    port: process.env.PORT || 3000,
    root: __dirname,
    env: env,
    version: packageJson.version,
    logger: logger,
    require: function (path) {
        return require(this.appPath(path))
    },
    appPath: function (path) {
        return this.root + "/" + path
    },
    start: function () {
        if (!this.started) {
            this.started = true;
            this.app.listen(this.port);
            this.logger.log('info', 'Running version %s on port %s', this.version, this.port);

        }
    },
    shutdown: function () {
        this.logger.log('info', 'Manually shutting down');
    }

};

if (!App.config) {
    App.logger.log('error', 'No config specified for %s environment', App.env);
};

App.app.use(express.static('www'));
App.require('./routes.js')(App.app);

App.start();
