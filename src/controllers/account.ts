import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { Account, addAccount, retrieveAccountByID, retrieveAllAccounts, retrieveAccountsByUserID, modifyAccount, removeAccount } from '../models/account'

export async function createAccount (req: Request, res: Response) {
  if (
    req.body.accountName && typeof req.body.accountName === 'string' &&
    req.body.ownerUserID && typeof req.body.ownerUserID === 'number' &&
    req.body.balance && typeof req.body.balance === 'number'
  ) {
    const accountObject: Account = {
      accountID: 0,
      accountName: req.body.accountName,
      ownerUserID: req.body.ownerUserID,
      balance: req.body.balance,
      deletedAt: null,
      lastUpdated: ''
    }
    try {
      console.log(accountObject)
      const result = await addAccount(accountObject)
      console.log(result)
      if (!result) {
        res.send('Account created')
      }
    } catch (error) {
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}

export async function readAccountByID (req: Request, res: Response) {
  try {
    const result = await retrieveAccountByID(req.params.accountid)
    if (result) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.send(500)
  }
}

export async function readAllAccounts (req: Request, res: Response) {
  try {
    const result = await retrieveAllAccounts()
    if (result) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function readAllAccountsByUserID (req: Request, res: Response) {
  try {
    const result = await retrieveAccountsByUserID(req.params.userid)
    if (result) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

export async function updateAccount (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10)) &&
    (req.body.accountName === undefined || typeof req.body.accountName === 'string') &&
    (req.body.ownerUserID === undefined || typeof req.body.ownerUserID === 'number') &&
    (req.body.deletedAt === undefined || typeof req.body.deletedAt === 'string') &&
    (req.body.balance === undefined || typeof req.body.balance === 'number')

  ) {
    try {
      const accountExists = await retrieveAccountByID(req.params.id)
      if (accountExists) {
        const accountObject: Account = {
          accountID: accountExists.accountID,
          accountName: accountExists.accountName,
          ownerUserID: accountExists.ownerUserID,
          balance: accountExists.balance,
          deletedAt: accountExists.deletedAt,
          lastUpdated: new Date().toISOString()
        }
        if (req.body.accountName !== undefined) {
          accountObject.accountName = req.body.accountName
        }
        if (req.body.dateCreated !== undefined) {
          accountObject.ownerUserID = req.body.ownerUserID
        }
        if (req.body.balance !== undefined) {
          accountObject.balance = req.body.balance
        }
        if (req.body.deletedAt !== undefined) {
          accountObject.deletedAt = req.body.deletedAt
        }
        const result = await modifyAccount(accountObject)
        console.log(accountObject)
        if (!result) {
          res.send('Successfully updated account')
        }
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}

export async function deleteAccount (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    try {
      const accountExists = await retrieveAccountByID(req.params.id)
      if (accountExists) {
        const result = await removeAccount(req.params.id)
        if (!result) {
          res.send('Successfully deleted account')
        }
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}
