import { Request, Response } from 'express'
import * as mysql from 'mysql';
import bodyParser = require('body-parser');
import * as dbFunctions from "../db";
import * as Joi from "joi";
import * as jwt from "jsonwebtoken";



export let get_acc_by_owner_user_id = (req: Request, res: Response) => {
    let sql: string = "SELECT * FROM accounts WHERE owner_user_id = ?";
    dbFunctions.queryRet(`SELECT * FROM accounts WHERE owner_user_id = '${req.params.id}'`, (result) => {
        if (result.length == 0) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

export let get_acc_by_account_id = (req: Request, res: Response) => {
    let sql = "SELECT * FROM accounts WHERE account_id = ?";
    connection.query(sql, req.params.account_id, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

export let create_new_acc = (req: Request, res: Response) => {
    let sql = "INSERT INTO accounts (account_name, owner_user_id, balance, last_updated) VALUES (?, ?, ?, DEFAULT)";
    let values = [req.body.account_name, req.body.owner_user_id, req.body.balance];
    connection.query(sql, values, (err, result) => {
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
    let sql1 = "SELECT * FROM accounts WHERE account_id = " + req.body.account_id;
    connection.query(sql1, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else {
            //calc new balance
            var new_balance = result[0].balance + req.body.amount;
            //update with new balance
            let sql = "UPDATE accounts SET balance = " + new_balance + ", last_updated = DEFAULT WHERE account_id = " + req.body.account_id;
            connection.query(sql, (err, result) => {
                if (err) 
                    res.status(500).json(err)
                else
                    res.json(result)
            })
        } 
    })
}

// unused block of transaction functions
/*export let get_trans_by_acc_id = (req: Request, res: Response) => {
    let sql = "SELECT * FROM transactions WHERE dbt_acc_id = " + req.params.acc_id + " OR crdt_acc_id = " + req.params.acc_id;
    connection.query(sql, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

export let get_trans_by_trans_id = (req: Request, res: Response) => {
    let sql = "SELECT * FROM transactions WHERE trans_id = " + req.params.trans_id;
    connection.query(sql, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

//FUTURE WORK: include sql query to update accounts table
export let create_new_trans = (req: Request, res: Response) => {
    let trans = req.body;
    //run debit on accounts table
    //run credit on accounts table
    let sql = "INSERT INTO transactions SET ?"
    connection.query(sql, trans, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}*/

export let get_user_by_user_id = (req: Request, res: Response) => {
    let sql = "SELECT * FROM users WHERE user_id = " + req.params.user_id;
    connection.query(sql, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

export let get_user_by_user_name = (req: Request, res: Response) => {
    let sql = "SELECT * FROM users WHERE user_name = '" + req.params.user_name + "'";
    connection.query(sql, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

export let create_new_user = (req: Request, res: Response) => {
    let sql = "INSERT INTO users (user_name, date_created, active) VALUES ('" + req.params.user_name + "', DEFAULT, " + 1 + ")";
    connection.query(sql, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

export let deactivate_status_of_user_id = (req: Request, res: Response) => {
    let sql = "UPDATE users SET active = 0 WHERE user_id = " + req.params.user_id;
    connection.query(sql, (err, result) => {
        if (err) 
            res.status(500).json(err)
        else
            res.json(result)
    })
}

