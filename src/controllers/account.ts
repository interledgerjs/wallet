import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as accountModel from '../models/account'
import { number } from 'joi'

export let createAccount = (req: Request, res: Response) => {
  // console.log('controller found')
  const accountObject: accountModel.Account = {
    accountID: null,
    accountName: req.body.accountName,
    ownerUserID: Number(req.params.userid),
    balance: req.body.balance,
    lastUpdated: null
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
    accountName: '',
    ownerUserID: Number(req.params.userid),
    balance: null,
    lastUpdated: ''
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
  accountModel.readAllAccounts((err, result) => {
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

export let readAllAccountsByUserID = (req: Request, res: Response) => {
  const accountObject: accountModel.Account = {
    accountID: null,
    accountName: '',
    ownerUserID: Number(req.params.userid),
    balance: null,
    lastUpdated: ''
  }
  accountModel.readAllAccountsByUserID(accountObject, (err, result) => {
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

export let updateAccount = (req: Request, res: Response) => {
  const accountObject: accountModel.Account = {
    accountID: Number(req.params.accountid),
    accountName: '',
    ownerUserID: Number(req.params.userid),
    balance: null,
    lastUpdated: null
  }
  accountModel.readAccountByID(accountObject, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else if (!result) {
      res.status(404).send('invalid ID requested')
    } else {
      const updatedAccount: accountModel.Account = {
        accountID: result[0].accountID,
        accountName: result[0].accountName,
        ownerUserID: result[0].ownerUserID,
        balance: result[0].balance,
        lastUpdated: null
      }
      if (req.body.accountName) {
        updatedAccount.accountName = req.body.accountName
      }
      if (req.body.balance) {
        updatedAccount.balance = req.body.balance
      }
      accountModel.updateAccount(updatedAccount, (err) => {
        if (err) {
          res.status(500).send('Account could not be updated')
        } else {
          res.send('Account updated')
        }
      })
    }
  })
}

export let deleteAccount = (req: Request, res: Response) => {
  const accountObject: accountModel.Account = {
    accountID: Number(req.params.accountid),
    accountName: '',
    ownerUserID: Number(req.params.userid),
    balance: null,
    lastUpdated: ''
  }
  accountModel.readAccountByID(accountObject, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (!result) {
        res.sendStatus(404)
      } else {
        accountModel.deleteAccount(accountObject, (err) => {
          if (err) {
            res.status(500).send('Unable to delete account')
          } else {
            res.send(`Account deleted`)
          }
        })
      }
    }
  })
}
