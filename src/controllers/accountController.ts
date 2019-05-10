import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
import { createLogger, format, transports } from 'winston'
import { addAccount, modifyAccount, removeAccount, retrieveAccountById, retrieveAccountByOwner, retrieveAccounts } from '../models'
import { isAuthorized, filterDeleted } from '../services'
import { validate } from '../services/validation'

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
  if (isAuthorized(req.authData, parseInt(req.body.owner, 10))) {
    const valid = validate(req, res)
    if (!valid) {
      return
    } else {
      req.body = valid
    }
    try {
      const result = await addAccount(req.body)
      res.send(result)
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(401)
  }
}

export async function readAccounts (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, query: req.query, path: req.path, method: req.method })
  const queryBy = Object.keys(req.query)[0]
  try {
    switch (queryBy) {
      case ('owner'):
        if (isAuthorized(req.authData, parseInt(req.query['owner'], 10))) {
          const accountsByOwner = await filterDeleted(await retrieveAccountByOwner(req.query.owner))
          if (accountsByOwner) {
            res.send(accountsByOwner)
          } else {
            res.sendStatus(404)
          }
        } else {
          res.sendStatus(401)
        }
        break
      default:
        if (isAuthorized(req.authData, null)) {
          const result = await retrieveAccounts()
          if (result) {
            res.send(result)
          } else {
            res.sendStatus(404)
          }
        } else {
          res.sendStatus(401)
        }
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

export async function readAccountById (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, query: req.query, path: req.path, method: req.method })
  try {
    const accountById = await retrieveAccountById(req.params.id)
    if (accountById && !accountById.deletedAt) {
      if (isAuthorized(req.authData, accountById.owner)) {
        res.send(accountById)
      } else {
        res.sendStatus(401)
      }
    } else {
      // known bug: returns 404 if account does not exist before it checks if user is authorized
      res.sendStatus(404)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

export async function updateAccount (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  const valid = validate(req, res)
  if (!valid) {
    return
  } else {
    req.body = valid
  }
  try {
    const accountExists = await retrieveAccountById(req.params.id)
    if (accountExists && !accountExists.deletedAt) {
      if (isAuthorized(req.authData, accountExists.owner)) {
        const result = await modifyAccount(accountExists, req.body)
        res.send(result)
      } else {
        res.sendStatus(401)
      }
    } else {
    // known bug: returns 404 if account does not exist before it checks if user is authorized
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
      if (accountExists && !accountExists.deletedAt) {
        if (accountExists.balance === 0) {
          const result = await removeAccount(req.params.id)
          if (result) {
            res.send(result)
          }
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
  } else {
    res.sendStatus(400)
  }
}
