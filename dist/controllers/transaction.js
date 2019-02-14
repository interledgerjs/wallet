"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbFunctions = require("../db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
//get /transaction #returns all transactions
exports.transactions = (req, res) => {
    dbFunctions.query("SELECT * FROM transactions", (err, result) => {
        if (err)
            res.status(500).send(err);
        else {
            if (result.length == 0) {
                res.sendStatus(404);
            }
            else
                res.json(result);
        }
    });
};
//get /transaction/{1} #returns transaction with id 1
exports.getTransaction = (req, res) => {
    dbFunctions.query(`SELECT * FROM transactions WHERE trans_id = '${req.params.id}'`, (err, result) => {
        if (err)
            res.status(500).send(err);
        else {
            if (result.length == 0) {
                res.sendStatus(404);
            }
            else
                res.json(result);
        }
    });
};
//post /transaction #adds new transaction to table
exports.addTransaction = (req, res) => {
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            const schema = Joi.object().keys({
                debt_acc_id: Joi.number().required(),
                crdt_acc_id: Joi.number().required(),
                amount: Joi.number().required()
            });
            const result = Joi.validate(req.body, schema);
            //    console.log(result);
            //    console.log(authData);
            if (result.error) {
                res.sendStatus(400);
            }
            else {
                let keys = "";
                let vals = "";
                for (var k in req.body) {
                    keys += `${k},`;
                    vals += `'${req.body[k]}',`;
                }
                if (keys.length > 0)
                    keys = keys.slice(0, -1);
                if (vals.length > 0)
                    vals = vals.slice(0, -1);
                dbFunctions.query(`INSERT INTO transactions (${keys}) VALUES (${vals})`, (err) => {
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(JSON.stringify(req.body));
                });
            }
        }
    });
};
//delete /transaction/{1} #removes transaction with id 1
exports.delTransaction = (req, res) => {
    // console.log(req.token);
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            dbFunctions.query(`SELECT * FROM transactions WHERE trans_id = '${req.params.id}'`, (err, result) => {
                if (err)
                    res.status(500).send(err);
                else {
                    if (result.length == 0) {
                        res.sendStatus(404);
                    }
                    else {
                        dbFunctions.query(`DELETE FROM transactions where trans_id = '${req.params.id}'`, (err, result) => {
                            if (err)
                                res.status(500).send(err);
                            else
                                res.send(`transaction id: ${req.params.id} deleted`);
                        });
                    }
                }
            });
        }
    });
};
//put /transaction/{1} #updates transaction with id 1
exports.updateTransaction = (req, res) => {
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            //Needs to have routing properly handled and sql to match schemas
            if (req.params.execute == 'execute') {
                let successful = 1;
                dbFunctions.query(`SELECT * FROM transactions WHERE transactionid = '${req.params.id}'`, (err, result) => {
                    if (err)
                        console.log(err);
                    if (result.length > 0) {
                        dbFunctions.query(`SELECT * FROM wallets WHERE walletid = '${result[0].sourceid}' OR walletid = '${result[0].destid}'`, (err, wResults) => {
                            if (err)
                                console.log(err);
                            if (wResults.length > 1) {
                                dbFunctions.query(`SELECT * FROM wallets WHERE walletid = '${result[0].sourceid}'`, (err, wResult) => {
                                    if (err)
                                        console.log(err);
                                    dbFunctions.query(`UPDATE wallets SET balance = '${parseInt(wResult[0].balance) - parseInt(result[0].value)}' WHERE walletid = '${result[0].sourceid}'`, (err) => {
                                        if (err)
                                            console.log(err);
                                    });
                                });
                                dbFunctions.query(`SELECT * FROM wallets WHERE walletid = '${result[0].destid}'`, (wResult) => {
                                    dbFunctions.query(`UPDATE wallets SET balance = '${parseInt(wResult[0].balance) + parseInt(result[0].value)}' WHERE walletid = '${result[0].destid}'`, (err) => {
                                        if (err)
                                            console.log(err);
                                    });
                                });
                                // console.log("successful update")
                            }
                            else {
                                successful = 0;
                                //res.sendStatus(404);
                                return;
                            }
                        });
                    }
                    else {
                        successful = 0;
                        //res.sendStatus(404);
                    }
                });
                if (successful) {
                    res.send('attempted transaction');
                }
            }
            else if (req.params.execute != null) {
                res.sendStatus(400);
            }
            else {
                const schema = Joi.object().keys({
                    debt_acc_id: Joi.number(),
                    crdt_acc_id: Joi.number(),
                    amount: Joi.number()
                }).or('debt_acc_id', 'crdt_acc_id', 'amount');
                const result = Joi.validate(req.body, schema);
                if (result.error) {
                    res.send(result.error.name).status(400);
                }
                else {
                    let str = "";
                    for (var k in req.body) {
                        str += `${k}='${req.body[k]}',`;
                    }
                    if (str.length > 0)
                        str = str.slice(0, -1);
                    dbFunctions.query(`UPDATE transactions SET ${str} WHERE trans_id = '${req.params.id}'`, (err) => {
                        if (err)
                            res.status(500).send(err);
                        else {
                            dbFunctions.query(`SELECT * FROM transactions WHERE trans_id = '${req.params.id}'`, (err, result) => {
                                if (err)
                                    res.status(500).send(err);
                                else {
                                    if (result.length == 0)
                                        res.status(404).send("invalid id requested");
                                    else
                                        res.json(result);
                                }
                            });
                        }
                    });
                }
            }
        }
    });
};
