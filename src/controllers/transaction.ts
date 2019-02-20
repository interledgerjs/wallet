import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as dlInterface from '../datalayer/dlInterface'

// get /transaction #returns all transactions
export let transactions = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'transactions',
    selectAll: true
  }
  dlInterface.handleOp(dataParams, (err, result) => {
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
  let dataParams = {
    action: 'get',
    table: 'transactions',
    selectAll: true,
    filter: [{ field: 'transID', operator: '=', value: req.params.id }]
  }
  dlInterface.handleOp(dataParams, (err, result) => {
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
  let dataParams = {
    action: 'post',
    table: 'transactions',
    parameters: req.body
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send('Transaction added')
    }
  })
}

// delete /transaction/{1} #removes transaction with id 1
export let delTransaction = (req: Request, res: Response) => {
  // console.log(req.token)
  let dataParams = {
    action: 'get',
    table: 'transactions',
    selectAll: true,
    filter: [{ field: 'transID', operator: '=', value: req.params.id }]
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        let delParams = {
          action: 'delete',
          table: 'transactions',
          filter: [{ field: 'transID', operator: '=', value: req.params.id }]
        }
        dlInterface.handleOp(delParams, (err, result) => {
          if (err) {
            res.status(500).send(err)
          } else {
            res.send(`Transaction id: ${req.params.id} deleted`)
          }
        })
      }
    }
  })

}

// put /transaction/{1} #updates transaction with id 1
export let updateTransaction = (req: Request, res: Response) => {
  let dataParams = {
    action: 'put',
    table: 'transactions',
    filter: [{ field: 'transID', operator: '=', value: req.params.id }],
    parameters: req.body
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      let getParams = {
        action: 'get',
        table: 'transactions',
        filter: [{ field: 'transID', operator: '=', value: req.params.id }],
        selectAll: true
      }
      dlInterface.handleOp(getParams, (err, result) => {
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
