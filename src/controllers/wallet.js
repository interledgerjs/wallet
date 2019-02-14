"use strict";
exports.__esModule = true;
var dbFunctions = require("../db");
var Joi = require("joi");
var jwt = require("jsonwebtoken");
//get /wallet #returns all wallets
exports.wallets = function (req, res) {
    dbFunctions.queryRet("SELECT * FROM wallets", function (result) {
        if (result.length == 0) {
            res.sendStatus(404);
        }
        else
            res.json(result);
    });
};
//get /wallet/{1} #returns wallet with id 1
exports.getWallet = function (req, res) {
    if (req.params.transactions == 'transactions') {
        dbFunctions.queryRet("SELECT *\n                            FROM transactions\n                            WHERE destid = '" + req.params.id + "' OR sourceid = '" + req.params.id + "'", function (result) {
            if (result.length == 0) {
                res.sendStatus(404);
            }
            else
                res.json(result);
        });
    }
    else if (req.params.transactions !== undefined) {
        console.log(req.params.transactions);
        res.sendStatus(400);
    }
    else {
        dbFunctions.queryRet("SELECT * FROM wallets WHERE walletid = '" + req.params.id + "'", function (result) {
            if (result.length == 0) {
                res.sendStatus(404);
            }
            else
                res.json(result);
        });
    }
};
//post /wallet #adds new wallet to table
exports.addWallet = function (req, res) {
    jwt.verify(req.token, "secret", function (err, authData) {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            var schema = Joi.object().keys({
                balance: Joi.number().required(),
                holder: Joi.string().required()
            });
            var result = Joi.validate(req.body, schema);
            //    console.log(result);
            if (result.error) {
                res.sendStatus(400);
            }
            else {
                var keys = "";
                var vals = "";
                for (var k in req.body) {
                    keys += k + ",";
                    vals += "'" + req.body[k] + "',";
                }
                if (keys.length > 0)
                    keys = keys.slice(0, -1);
                if (vals.length > 0)
                    vals = vals.slice(0, -1);
                dbFunctions.queryNoRet("INSERT INTO wallets (" + keys + ") VALUES (" + vals + ")");
                res.send(JSON.stringify(req.body));
            }
        }
    });
};
//delete /wallet/{1} #removes wallet with id 1
exports.delWallet = function (req, res) {
    jwt.verify(req.token, "secret", function (err, authData) {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            dbFunctions.queryRet("SELECT * FROM wallets WHERE walletid = '" + req.params.id + "'", function (result) {
                if (result.length == 0) {
                    res.sendStatus(404);
                }
                else {
                    dbFunctions.queryNoRet("DELETE FROM wallets where walletid = '" + req.params.id + "'");
                    res.send("Wallet id: " + req.params.id + " deleted");
                }
            });
        }
    });
};
//put /wallet/{1} #updates wallet with id 1
exports.updateWallet = function (req, res) {
    jwt.verify(req.token, "secret", function (err, authData) {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            var schema = Joi.object().keys({
                balance: Joi.number(),
                holder: Joi.string()
            }).or('balance', 'holder');
            var result = Joi.validate(req.body, schema);
            if (result.error) {
                res.sendStatus(400);
            }
            else {
                var str = "";
                for (var k in req.body) {
                    str += k + "='" + req.body[k] + "',";
                }
                if (str.length > 0)
                    str = str.slice(0, -1);
                dbFunctions.queryNoRet("UPDATE wallets SET " + str + " WHERE walletid = '" + req.params.id + "'");
                dbFunctions.queryRet("SELECT * FROM wallets WHERE walletid = '" + req.params.id + "'", function (result) {
                    if (result.length == 0) {
                        //    console.log(404);
                        res.status(404);
                        res.send("invalid id requested");
                    }
                    else
                        res.json(result);
                });
            }
        }
    });
};
