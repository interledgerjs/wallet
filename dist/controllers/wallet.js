"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbFunctions = require("../db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
//get /wallet #returns all wallets
exports.wallets = (req, res) => {
    dbFunctions.query("SELECT * FROM accounts", (err, result) => {
        if (err)
            res.status(500).send(err);
        else {
            if (result.length == 0)
                res.sendStatus(404);
            else
                res.json(result);
        }
    });
};
//get /wallet/{1} #returns wallet with id 1
exports.getWallet = (req, res) => {
    if (req.params.transactions == 'transactions') {
        dbFunctions.query(`SELECT * FROM transactions WHERE destid = '${req.params.id}' OR sourceid = '${req.params.id}'`, (err, result) => {
            if (err)
                res.status(500).send(err);
            else {
                if (result.length == 0)
                    res.sendStatus(404);
                else
                    res.json(result);
            }
        });
    }
    else if (req.params.transactions !== undefined) {
        console.log(req.params.transactions);
        res.sendStatus(400);
    }
    else {
        dbFunctions.query(`SELECT * FROM wallets WHERE walletid = '${req.params.id}'`, (err, result) => {
            if (err)
                res.status(500).send(err);
            else {
                if (result.length == 0)
                    res.sendStatus(404);
                else
                    res.json(result);
            }
        });
    }
};
//post /wallet #adds new wallet to table
exports.addWallet = (req, res) => {
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            const schema = Joi.object().keys({
                balance: Joi.number().required(),
                holder: Joi.string().required()
            });
            const result = Joi.validate(req.body, schema);
            //    console.log(result);
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
                dbFunctions.query(`INSERT INTO wallets (${keys}) VALUES (${vals})`, (err) => {
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(JSON.stringify(req.body));
                });
            }
        }
    });
};
//delete /wallet/{1} #removes wallet with id 1
exports.delWallet = (req, res) => {
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            dbFunctions.query(`SELECT * FROM wallets WHERE walletid = '${req.params.id}'`, (err, result) => {
                if (err)
                    res.status(500).send(err);
                else {
                    if (result.length == 0) {
                        res.sendStatus(404);
                    }
                    else {
                        dbFunctions.query(`DELETE FROM wallets where walletid = '${req.params.id}'`, (err) => {
                            if (err)
                                res.status(500).send(err);
                            else
                                res.send(`Wallet id: ${req.params.id} deleted`);
                        });
                    }
                }
            });
        }
    });
};
//put /wallet/{1} #updates wallet with id 1
exports.updateWallet = (req, res) => {
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            const schema = Joi.object().keys({
                balance: Joi.number(),
                holder: Joi.string()
            }).or('balance', 'holder');
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                res.sendStatus(400);
            }
            else {
                let str = "";
                for (var k in req.body) {
                    str += `${k}='${req.body[k]}',`;
                }
                if (str.length > 0)
                    str = str.slice(0, -1);
                dbFunctions.query(`UPDATE wallets SET ${str} WHERE walletid = '${req.params.id}'`, (err) => {
                    if (err)
                        res.status(500).send(err);
                    else {
                        dbFunctions.query(`SELECT * FROM wallets WHERE walletid = '${req.params.id}'`, (err, result) => {
                            if (err)
                                res.status(500).send(err);
                            else {
                                if (result.length == 0) {
                                    //    console.log(404);
                                    res.status(404);
                                    res.send("invalid id requested");
                                }
                                else
                                    res.json(result);
                            }
                        });
                    }
                });
            }
        }
    });
};
