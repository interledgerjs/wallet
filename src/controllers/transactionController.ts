import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
import { createLogger, format, transports } from 'winston'
import { addTransaction, retrieveTransactionById, retrieveTransactions, retrieveTransactionsByAccountId } from '../models'

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
    const failure = await addTransaction(req.body)
    if (!failure) {
      res.sendStatus(200)
    } else {
      res.sendStatus(400)
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
      case ('id'):
        const idResult = await retrieveTransactionById(req.query.id)
        if (!idResult) {
          res.sendStatus(404)
        } else {
          res.send(idResult)
        }
        break
      case ('account'):
        const result = await retrieveTransactionsByAccountId(req.query.account)
        if (result.length === 0) {
          res.sendStatus(404)
        } else {
          res.send(result)
        }
        break
      default:
        const allResult = await retrieveTransactions()
        if (allResult.length === 0) {
          res.sendStatus(404)
        } else {
          res.send(allResult)
        }
        break
    }
  } catch (error) {
    res.sendStatus(500)
    logger.error(error)
  }
}
