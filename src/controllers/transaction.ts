import { Request, Response } from 'express'
import * as dbFunctions from '../db'
import * as Joi from 'joi'
import * as jwt from 'jsonwebtoken'

// get /transaction #returns all transactions
export let transactions = (req: Request, res: Response) => {
  dbFunctions.query('SELECT * FROM transactions', (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.json(result)
      }
    }
  })
}

// ------------------------------------------------------------------------------------------------------------------------------
// Use script to initialise db
// check: 12 factor app, .env, hibernate, ORM, mocha
// build data layer for further abstraction, create separation between low level data and do further processing in controllers
//
// mvc mvm
//
// ------------------------------------------------------------------------------------------------------------------------------

// get /transaction/{1} #returns transaction with id 1
export let getTransaction = (req: Request, res: Response) => {
  dbFunctions.query(`SELECT * FROM transactions WHERE trans_id = '${req.params.id}'`, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.json(result)
      }
    }
  })
}

// post /transaction #adds new transaction to table
export let addTransaction = (req: Request, res: Response) => {
  const schema = Joi.object().keys({
    dbt_acc_id: Joi.number().required(),
    crdt_acc_id: Joi.number().required(),
    amount: Joi.number().required()
  })
  const result = Joi.validate(req.body, schema)
        //    console.log(result);
        //    console.log(authData);
  if (result.error) {
    res.sendStatus(400)
  } else {
    let keys: string = ''
    let vals: string = ''
    for (let k in req.body) {
      keys += `${k},`
      vals += `'${req.body[k]}',`
    }
    if (keys.length > 0) keys = keys.slice(0, -1)
    if (vals.length > 0) vals = vals.slice(0, -1)
    dbFunctions.query(`INSERT INTO transactions (${keys}) VALUES (${vals})`, (err) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.send(JSON.stringify(req.body))
      }
    })
  }
}

// delete /transaction/{1} #removes transaction with id 1
export let delTransaction = (req: Request, res: Response) => {
    // console.log(req.token);
  dbFunctions.query(`SELECT * FROM transactions WHERE trans_id = '${req.params.id}'`, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        dbFunctions.query(`DELETE FROM transactions where trans_id = '${req.params.id}'`, (err, result) => {
          if (err) {
            res.status(500).send(err)
          } else {
            res.send(`transaction id: ${req.params.id} deleted`)
          }
        })
      }
    }
  })
}

// put /transaction/{1} #updates transaction with id 1
export let updateTransaction = (req: Request, res: Response) => {
  const schema = Joi.object().keys({
                dbt_acc_id: Joi.number(),
                crdt_acc_id: Joi.number(),
                amount: Joi.number()
            }).or('dbt_acc_id', 'crdt_acc_id', 'amount')
  const result = Joi.validate(req.body, schema)
  if (result.error) {
    res.send(result.error.name).status(400)
  } else {
    let str: string = ''
    for (let k in req.body) {
      str += `${k}='${req.body[k]}',`
    }
    if (str.length > 0) str = str.slice(0, -1)
    dbFunctions.query(`UPDATE transactions SET ${str} WHERE trans_id = '${req.params.id}'`, (err) => {
      if (err) {
        res.status(500).send(err)
      } else {
        dbFunctions.query(`SELECT * FROM transactions WHERE trans_id = '${req.params.id}'`, (err, result) => {
          if (err) {
            res.status(500).send(err)
          } else {
            if (result.length === 0) {
              res.status(404).send('invalid id requested')
            } else {
              res.json(result)
            }
          }
        })
      }
    })
  }
}
