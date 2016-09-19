var env = process.env.NODE_ENV || 'development';
var express = require('express');
var packageJson = require('./package.json');
var logger = require('./logging.js');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

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

App.logger.transports.console.level = App.config.logLevel;
App.app.use(express.static('www'));
App.app.use(bodyParser.json());
App.app.use(passport.initialize());

App.require('./routes.js')(App.app);
mongoose.connect(App.config.db.connection);
App.start();
