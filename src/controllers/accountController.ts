import { Request, Response } from 'express'
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
  try {
    const result = await addAccount(req.body)
    if (!result) {
      res.sendStatus(200)
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

export async function readAccounts (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, query: req.query, path: req.path, method: req.method })
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
  try {
    const accountExists = await retrieveAccountById(req.params.id)
    if (accountExists) {
      const result = await modifyAccount(accountExists, req.body)
      if (!result) {
        res.sendStatus(200)
      } else {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
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
