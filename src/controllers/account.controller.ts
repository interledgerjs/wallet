import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as accountModel from '../models/account.model'
import { number } from 'joi'

export let createAccount = (req: Request, res: Response) => {
  // console.log('controller found')
  const accountObject: accountModel.Account = {
    accountID: null,
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
    accountName: '',
    ownerUserID: Number(req.params.userid),
    balance: null,
    last_updated: ''
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
    last_updated: ''
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

// export let updateAccount = (req: Request, res: Response) => {
//   let dataParams = {
//     action: 'put',
//     table: 'accounts',
//     filter: [{ field: 'accountID', operator: '=', value: req.params.ID }],
//     parameters: req.body
//   }
//   dlInterface.handleOp(dataParams, (err, result) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       let getParams = {
//         action: 'get',
//         table: 'accounts',
//         filter: [{ field: 'accountID', operator: '=', value: req.params.ID }],
//         selectAll: true
//       }
//       dlInterface.handleOp(getParams, (err, result) => {
//         if (err) {
//           res.status(500).send(err)
//         } else {
//           if (result.length === 0) {
//             res.status(404).send('invalid ID requested')
//           } else {
//             res.json(result)
//           }
//         }
//       })
//     }
//   })
// }

export let deleteAccount = (req: Request, res: Response) => {
  const accountObject: accountModel.Account = {
    accountID: Number(req.params.accountid),
    accountName: '',
    ownerUserID: Number(req.params.userid),
    balance: null,
    last_updated: ''
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
