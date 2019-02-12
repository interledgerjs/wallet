"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//verifyToken
exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        //console.log(req.token);
        req['token'] = bearerToken;
        next();
    }
    else {
        res.sendStatus(403);
    }
};
