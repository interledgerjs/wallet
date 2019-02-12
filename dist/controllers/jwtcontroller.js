"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as Joi from "joi";
const jwt = require("jsonwebtoken");
exports.genToken = (req, res) => {
    jwt.sign({ foo: 'bar' }, "secret", { expiresIn: '1h' }, (err, token) => {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ token });
        }
    });
};
