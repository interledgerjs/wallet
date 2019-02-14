import { Request, Response } from 'express'
import * as dbFunctions from "../db";
import * as Joi from "joi";
import * as jwt from "jsonwebtoken";

export let get_accs_by_owner_user_id = (req: Request, res: Response) => {
    dbFunctions.query(`SELECT * FROM accounts WHERE owner_user_id = '${req.params.id}'`, (err, result) => {
        if (result.length == 0) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

export let get_acc_by_account_id = (req: Request, res: Response) => {
    let sql = `SELECT * FROM accounts WHERE account_id = ?`;
    dbFunctions.query(`SELECT * FROM accounts WHERE account_id = '${req.params.account_id}'`, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

export let create_new_acc = (req: Request, res: Response) => {
    dbFunctions.query(`INSERT INTO accounts (account_name, owner_user_id, balance, last_updated) VALUES ('${req.body.account_name}', '${req.body.owner_user_id}', '${req.body.balance}', DEFAULT)`, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

//FUTURE WORK:  implement parsing as int
//              implement simultaneous updating of dbt and crdt acc's
export let update_acc = (req: Request, res: Response) => {
    //get old balance
    dbFunctions.query(`SELECT * FROM accounts WHERE account_id = '${req.body.account_id}'`, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else {
            //calc new balance
            var new_balance = result[0].balance + req.body.amount;
            //update with new balance
            dbFunctions.query(`UPDATE accounts SET balance = '${new_balance}', last_updated = DEFAULT WHERE account_id = '${req.body.account_id}'`, (err, result) => {
                if (err) 
                    res.status(500).json(err)
                else
                    res.json(result)
            })
        } 
    })
}