import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
import { createLogger, format, transports } from 'winston'
import { addTransaction, retrieveTransactionById, retrieveTransactions, retrieveTransactionsByAccountId, retrieveAccountById, calculateBalance } from '../models'
import { isAuthorized } from '../services'
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

// post /transactions #adds new transaction to table
export async function createTransaction (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  try {
    const authorizedAccount = await retrieveAccountById(req.body.debitAccountId)
    if (!authorizedAccount) {
      res.sendStatus(400)
      return
    }
    if (isAuthorized(req.authData, authorizedAccount.owner)) {
      if (!validate(req, res)) {
        return
      }
      const balance = await calculateBalance(req.body.debitAccountId)
      const debitAccount = await retrieveAccountById(req.body.debitAccountId)
      const creditAccount = await retrieveAccountById(req.body.creditAccountId)
      if ((balance > 0 || req.body.debitAccountId === 1) && creditAccount && debitAccount) {
        const result = await addTransaction(req.body)
        if (result) {
          res.send(result)
        } else {
          res.sendStatus(400)
        }
      } else {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

// get /transactions #returns all transactions
export async function readTransactions (req: Request, res: Response) {
  const queryVal = Object.keys(req.query)[0]
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  try {
    switch (queryVal) {
      case ('account'):
        const requestedAccount = await retrieveAccountById(req.query.account)
        if (requestedAccount) {
          if (isAuthorized(req.authData, requestedAccount.owner)) {
            const result = await retrieveTransactionsByAccountId(req.query.account)
            res.send(result)
          } else {
            res.sendStatus(401)
          }
        } else {
          res.send([])
        }
        break
      default:
        if (isAuthorized(req.authData, null)) {
          const allResult = await retrieveTransactions()
          res.send(allResult)
        } else {
          res.sendStatus(401)
        }
        break
    }
  } catch (error) {
    res.sendStatus(500)
    logger.error(error)
  }
}

export async function readTransactionById (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (isAuthorized(req.authData, parseInt(req.params.id, 10))) {
    try {
      const idResult = await retrieveTransactionById(req.params.id)
      if (!idResult) {
        res.sendStatus(404)
      } else {
        res.send(idResult)
      }
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(401)
  }
}
