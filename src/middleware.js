"use strict";
exports.__esModule = true;
//verifyToken
exports.verifyToken = function (req, res, next) {
    var bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        var bearer = bearerHeader.split(' ');
        var bearerToken = bearer[1];
        //console.log(req.token);
        req['token'] = bearerToken;
        next();
    }
    else {
        res.sendStatus(403);
    }
};
