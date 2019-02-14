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
    //routing needs to be redone for /accounts/{id}/transactions
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
        dbFunctions.query(`SELECT * FROM accounts WHERE account_id = '${req.params.id}'`, (err, result) => {
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
                account_name: Joi.string().required(),
                owner_user_id: Joi.number().required(),
                balance: Joi.number().required()
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
                dbFunctions.query(`INSERT INTO accounts (${keys}) VALUES (${vals})`, (err) => {
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
            dbFunctions.query(`SELECT * FROM accounts WHERE account_id = '${req.params.id}'`, (err, result) => {
                if (err)
                    res.status(500).send(err);
                else {
                    if (result.length == 0) {
                        res.sendStatus(404);
                    }
                    else {
                        dbFunctions.query(`DELETE FROM accounts where account_id = '${req.params.id}'`, (err) => {
                            if (err)
                                res.status(500).send(err);
                            else
                                res.send(`Account id: ${req.params.id} deleted`);
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
                account_name: Joi.string(),
                owner_user_id: Joi.number(),
                balance: Joi.number()
            }).or('account_name', 'owner_user_id', 'balance');
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
                dbFunctions.query(`UPDATE accounts SET ${str} WHERE account_id = '${req.params.id}'`, (err) => {
                    if (err)
                        res.status(500).send(err);
                    else {
                        dbFunctions.query(`SELECT * FROM accounts WHERE account_id = '${req.params.id}'`, (err, result) => {
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
