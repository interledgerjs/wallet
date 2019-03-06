import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as dlInterface from '../datalayer/dlInterface'
import * as accountModel from '../models/account.model'
import { number } from 'joi'

// post /account #adds new account to table
export let createAccount = (req: Request, res: Response) => {
  console.log('controller found')
  const account: accountModel.Account = {
    accountId: 1,
    accountName: req.body.accountName,
    ownerUserId: Number(req.params.id),
    balance: req.body.balance,
    last_updated: new Date().toISOString()
  }
  accountModel.createAccount(account, function (err) {
    if (err) {
      res.status(500).send('Unable to create account')
    } else {
      res.send('Account created')
    }
  })

}

// get /account #returns all accounts
export let readAllAccounts = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
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

// get /account/{1} #returns account with id 1
export let readAllAccountsByUserId = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true,
    filter: [{ field: 'accountID', operator: '=', value: req.params.id }]
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

// get /account/{1} #returns account with id 1
export let readAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true,
    filter: [{ field: 'accountID', operator: '=', value: req.params.id }]
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

// delete /account/{1} #removes account with id 1
export let deleteAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true,
    filter: [{ field: 'accountID', operator: '=', value: req.params.id }]
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
          table: 'accounts',
          filter: [{ field: 'accountID', operator: '=', value: req.params.id }]
        }
        dlInterface.handleOp(delParams, (err, result) => {
          if (err) {
            res.status(500).send(err)
          } else {
            res.send(`account id: ${req.params.id} deleted`)
          }
        })
      }
    }
  })
}

// put /account/{1} #updates account with id 1
export let updateAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'put',
    table: 'accounts',
    filter: [{ field: 'accountID', operator: '=', value: req.params.id }],
    parameters: req.body
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      let getParams = {
        action: 'get',
        table: 'accounts',
        filter: [{ field: 'accountID', operator: '=', value: req.params.id }],
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
