"use strict";
exports.__esModule = true;
var dbFunctions = require("../db");
var Joi = require("joi");
var jwt = require("jsonwebtoken");
//get /transaction #returns all transactions
exports.transactions = function (req, res) {
    dbFunctions.queryRet("SELECT * FROM transactions", function (result) {
        if (result.length == 0) {
            res.sendStatus(404);
        }
        else
            res.json(result);
    });
};
//get /transaction/{1} #returns transaction with id 1
exports.getTransaction = function (req, res) {
    dbFunctions.queryRet("SELECT * FROM transactions WHERE transactionid = '" + req.params.id + "'", function (result) {
        if (result.length == 0) {
            res.sendStatus(404);
        }
        else
            res.json(result);
    });
};
//post /transaction #adds new transaction to table
exports.addTransaction = function (req, res) {
    jwt.verify(req.token, "secret", function (err, authData) {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            var schema = Joi.object().keys({
                value: Joi.number().required(),
                sourceid: Joi.number().required(),
                destid: Joi.number().required()
            });
            var result = Joi.validate(req.body, schema);
            //    console.log(result);
            //    console.log(authData);
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
                dbFunctions.queryNoRet("INSERT INTO transactions (" + keys + ") VALUES (" + vals + ")");
                res.send(JSON.stringify(req.body));
            }
        }
    });
};
//delete /transaction/{1} #removes transaction with id 1
exports.delTransaction = function (req, res) {
    // console.log(req.token);
    jwt.verify(req.token, "secret", function (err, authData) {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            dbFunctions.queryRet("SELECT * FROM transactions WHERE transactionid = '" + req.params.id + "'", function (result) {
                if (result.length == 0) {
                    res.sendStatus(404);
                }
                else {
                    dbFunctions.queryNoRet("DELETE FROM transactions where transactionid = '" + req.params.id + "'");
                    res.send("transaction id: " + req.params.id + " deleted");
                }
            });
        }
    });
};
//put /transaction/{1} #updates transaction with id 1
exports.updateTransaction = function (req, res) {
    jwt.verify(req.token, "secret", function (err, authData) {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            if (req.params.execute == 'execute') {
                var successful_1 = 1;
                dbFunctions.queryRet("SELECT * FROM transactions WHERE transactionid = '" + req.params.id + "'", function (result) {
                    if (result.length > 0) {
                        dbFunctions.queryRet("SELECT * FROM wallets WHERE walletid = '" + result[0].sourceid + "' OR walletid = '" + result[0].destid + "'", function (wResults) {
                            if (wResults.length > 1) {
                                dbFunctions.queryRet("SELECT * FROM wallets WHERE walletid = '" + result[0].sourceid + "'", function (wResult) {
                                    dbFunctions.queryNoRet("UPDATE wallets SET balance = '" + (parseInt(wResult[0].balance) - parseInt(result[0].value)) + "' WHERE walletid = '" + result[0].sourceid + "'");
                                });
                                dbFunctions.queryRet("SELECT * FROM wallets WHERE walletid = '" + result[0].destid + "'", function (wResult) {
                                    dbFunctions.queryNoRet("UPDATE wallets SET balance = '" + (parseInt(wResult[0].balance) + parseInt(result[0].value)) + "' WHERE walletid = '" + result[0].destid + "'");
                                });
                                // console.log("successful update")
                            }
                            else {
                                successful_1 = 0;
                                //res.sendStatus(404);
                                return;
                            }
                        });
                    }
                    else {
                        successful_1 = 0;
                        //res.sendStatus(404);
                    }
                });
                if (successful_1) {
                    res.send('attempted transaction');
                }
            }
            else if (req.params.execute != null) {
                res.sendStatus(400);
            }
            else {
                var schema = Joi.object().keys({
                    value: Joi.number(),
                    sourceid: Joi.number(),
                    destid: Joi.number()
                }).or('value', 'sourceid', 'destid');
                var result = Joi.validate(req.body, schema);
                if (result.error) {
                    res.send(result.error.name).status(400);
                }
                else {
                    var str = "";
                    for (var k in req.body) {
                        str += k + "='" + req.body[k] + "',";
                    }
                    if (str.length > 0)
                        str = str.slice(0, -1);
                    dbFunctions.queryNoRet("UPDATE transactions SET " + str + " WHERE transactionid = '" + req.params.id + "'");
                    dbFunctions.queryRet("SELECT * FROM transactions WHERE transactionid = '" + req.params.id + "'", function (result) {
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
        }
    });
};
