"use strict";
exports.__esModule = true;
//import * as Joi from "joi";
var jwt = require("jsonwebtoken");
exports.genToken = function (req, res) {
    jwt.sign({ foo: 'bar' }, "secret", { expiresIn: '1h' }, function (err, token) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ token: token });
        }
    });
};
