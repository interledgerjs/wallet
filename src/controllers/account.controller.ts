import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as accountModel from '../models/account.model'
import { number } from 'joi'

export let createAccount = (req: Request, res: Response) => {
  console.log('controller found')
  const accountObject: accountModel.Account = {
    accountID: 1,
    accountName: req.body.accountName,
    ownerUserID: Number(req.params.userid),
    balance: req.body.balance,
    last_updated: new Date().toISOString()
  }
  accountModel.createAccount(accountObject, function (err) {
    if (err) {
      res.status(500).send('Unable to create account')
    } else {
      res.send('Account created')
    }
  })

}

export let readAccountByID = (req: Request, res: Response) => {
  const accountObject: accountModel.Account = {
    accountID: Number(req.params.accountid),
    accountName: '-1',
    ownerUserID: Number(req.params.userid),
    balance: -1,
    last_updated: '-1'
  }
  accountModel.readAccountByID(accountObject, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (!result) {
        res.sendStatus(404)
      } else {
        res.json(result)
      }
    }
  })
}

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

export let readAllAccountsByUserID = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true,
    filter: [{ field: 'accountID', operator: '=', value: req.params.ID }]
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

export let deleteAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true,
    filter: [{ field: 'accountID', operator: '=', value: req.params.ID }]
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
          filter: [{ field: 'accountID', operator: '=', value: req.params.ID }]
        }
        dlInterface.handleOp(delParams, (err, result) => {
          if (err) {
            res.status(500).send(err)
          } else {
            res.send(`account ID: ${req.params.ID} deleted`)
          }
        })
      }
    }
  })
}

export let updateAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'put',
    table: 'accounts',
    filter: [{ field: 'accountID', operator: '=', value: req.params.ID }],
    parameters: req.body
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      let getParams = {
        action: 'get',
        table: 'accounts',
        filter: [{ field: 'accountID', operator: '=', value: req.params.ID }],
        selectAll: true
      }
      dlInterface.handleOp(getParams, (err, result) => {
        if (err) {
          res.status(500).send(err)
        } else {
          if (result.length === 0) {
            res.status(404).send('invalid ID requested')
          } else {
            res.json(result)
          }
        }
      })
    }
  })
}
