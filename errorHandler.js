exports.logAndSend = function(err, msg, next) {
    App.logger.log('error', err);
    next(msg);
}