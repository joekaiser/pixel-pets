module.exports.ping = function (req, res) {
    res.json({
        success: true,
        payload: {
            version: App.version,
            env: App.env
        }
    });
};
