import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { Account, addAccount, retrieveAccountById, retrieveAccounts, retrieveAccountByOwner, modifyAccount, removeAccount } from '../models/accountModel'
import { createLogger, transports, format } from 'winston'
import * as dotenv from 'dotenv'

dotenv.config()
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports : []
})
if (process.env.CONSOLELOG === 'true') {
  logger.add(new transports.Console())
}
if (process.env.LOGFILE === 'true') {
  logger.add(new transports.File({ filename: 'logs.log' }))
}

export async function createAccount (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (
    req.body.name && typeof req.body.name === 'string' &&
    req.body.owner && typeof req.body.owner === 'number' &&
    req.body.balance && typeof req.body.balance === 'number'
  ) {
    const accountObject: Account = {
      id: 0,
      name: req.body.name,
      owner: req.body.owner,
      balance: req.body.balance,
      deletedAt: '',
      lastUpdated: ''
    }
    try {
      const result = await addAccount(accountObject)
      if (!result) {
        res.sendStatus(200)
      }
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}

export async function readAccounts (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  const queryBy = Object.keys(req.query)[0]
  try {
    switch (queryBy) {
      case ('id') :
        const accountById = await retrieveAccountById(req.query.id)
        if (accountById) {
          res.send(accountById)
        } else {
          res.sendStatus(404)
        }
        break
      case ('owner'):
        const accountsByOwner = await retrieveAccountByOwner(req.query.owner)
        if (accountsByOwner) {
          res.send(accountsByOwner)
        } else {
          res.sendStatus(404)
        }
        break
      default:
        const result = await retrieveAccounts()
        if (result) {
          res.send(result)
        } else {
          res.sendStatus(404)
        }
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

export async function updateAccount (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10)) &&
    (req.body.name === undefined || typeof req.body.name === 'string') &&
    (req.body.owner === undefined || typeof req.body.owner === 'number') &&
    (req.body.deletedAt === undefined || typeof req.body.deletedAt === 'string') &&
    (req.body.balance === undefined || typeof req.body.balance === 'number')

  ) {
    try {
      const accountExists = await retrieveAccountById(req.params.id)
      if (accountExists) {
        const accountObject: Account = {
          id: accountExists.id,
          name: accountExists.name,
          owner: accountExists.owner,
          balance: accountExists.balance,
          deletedAt: accountExists.deletedAt,
          lastUpdated: new Date().toISOString()
        }
        if (req.body.name !== undefined) {
          accountObject.name = req.body.name
        }
        if (req.body.dateCreated !== undefined) {
          accountObject.owner = req.body.owner
        }
        if (req.body.balance !== undefined) {
          accountObject.balance = req.body.balance
        }
        if (req.body.deletedAt !== undefined) {
          accountObject.deletedAt = req.body.deletedAt
        }
        const result = await modifyAccount(accountObject)
        if (!result) {
          res.sendStatus(200)
        }
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}

export async function deleteAccount (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    try {
      const accountExists = await retrieveAccountById(req.params.id)
      if (accountExists) {
        const result = await removeAccount(req.params.id)
        if (!result) {
          res.send('Successfully deleted account')
        }
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}
