import { Request, Response } from "express";
import * as dbFunctions from "../db";
import * as Joi from "joi";
import * as jwt from "jsonwebtoken";

//get /wallet #returns all wallets
export let wallets = (req: Request, res: Response) => {
    dbFunctions.queryRet("SELECT * FROM wallets", (result) => {
        if (result.length == 0) {
            res.sendStatus(404);
        }
        else
            res.json(result);
    });
}

//get /wallet/{1} #returns wallet with id 1
export let getWallet = (req: Request, res: Response) => {
    if (req.params.transactions == 'transactions') {
        dbFunctions.queryRet(`SELECT *
                            FROM transactions
                            WHERE destid = '${req.params.id}' OR sourceid = '${req.params.id}'`
                            , (result) => {
            if (result.length == 0) {
                res.sendStatus(404);
            }
            else
                res.json(result);
        });
    }
    else if (req.params.transactions !== undefined) {
        console.log(req.params.transactions)
        res.sendStatus(400);
    }
    else {
        dbFunctions.queryRet(`SELECT * FROM wallets WHERE walletid = '${req.params.id}'`, (result) => {
            if (result.length == 0) {
                res.sendStatus(404);
            }
            else
                res.json(result);
        });
    }
}

//post /wallet #adds new wallet to table
export let addWallet = (req : Request, res: Response) => {
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            const schema = Joi.object().keys({
                balance:Joi.number().required(),
                holder: Joi.string().required()
            });
            const result = Joi.validate(req.body, schema);
        //    console.log(result);
            if (result.error) {
                res.sendStatus(400);
            }
            else {
                let keys: string = "";
                let vals: string = "";
                for (var k in req.body) {
                    keys += `${k},`;
                    vals += `'${req.body[k]}',`
                }
                if (keys.length > 0) keys = keys.slice(0, -1);
                if (vals.length > 0) vals = vals.slice(0, -1);
                dbFunctions.queryNoRet(`INSERT INTO wallets (${keys}) VALUES (${vals})`);
                res.send(JSON.stringify(req.body));
            }
        }
    });
}

//delete /wallet/{1} #removes wallet with id 1
export let delWallet = (req : Request, res: Response) => {
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            dbFunctions.queryRet(`SELECT * FROM wallets WHERE walletid = '${req.params.id}'`, (result) => {
                if (result.length == 0) {
                    res.sendStatus(404);
                }
                else {
                    dbFunctions.queryNoRet(`DELETE FROM wallets where walletid = '${req.params.id}'`);
                    res.send(`Wallet id: ${req.params.id} deleted`);
                }
            });
        }
    });
}

//put /wallet/{1} #updates wallet with id 1
export let updateWallet = (req : Request, res: Response) => {
    jwt.verify(req.token, "secret", (err, authData) => {
        if (err) {
            res.status(403).send(err.message);
        }
        else {
            const schema = Joi.object().keys({
                balance:Joi.number(),
                holder: Joi.string()
            }).or('balance', 'holder');
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                res.sendStatus(400)
            }
            else {
                let str: string = "";
                for (var k in req.body) {
                    str += `${k}='${req.body[k]}',`;
                }
                if (str.length > 0) str = str.slice(0, -1);
                dbFunctions.queryNoRet(`UPDATE wallets SET ${str} WHERE walletid = '${req.params.id}'`);
                dbFunctions.queryRet(`SELECT * FROM wallets WHERE walletid = '${req.params.id}'`, (result) => {
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
}
