import { Request, Response } from 'express'
import { Transaction, addTransaction, retrieveTransactions, retrieveTransactionById, retrieveTransactionsByAccountId } from '../models/transactionModel'
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

// post /transactions #adds new transaction to table
export async function createTransaction (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (
    req.body.debitAccount && typeof req.body.debitAccount === 'number' &&
    req.body.creditAccount && typeof req.body.creditAccount === 'number' &&
    req.body.amount && typeof req.body.amount === 'number'
  ) {
    const transObject: Transaction = {
      id: -1,
      debitAccount: req.body.debitAccount,
      creditAccount: req.body.creditAccount,
      amount: req.body.amount,
      date: new Date().toISOString()
    }
    if (req.body.id && typeof req.body.debitAccount === 'number') {
      transObject.id = req.body.id
    }

    try {
      const failure = await addTransaction(transObject)
      if (!failure) {
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

// get /transactions #returns all transactions
export async function readTransactions (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  try {
    const result = await retrieveTransactions()
    if (result.length === 0) {
      res.sendStatus(404)
    } else {
      res.send(result)
    }
  } catch (error) {
    res.sendStatus(500)
    logger.error(error)
  }
}

// get /transactions/id/:id #returns single transaction by id
export async function readTransactionById (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    const id: number = req.params.id

    try {
      const result = await retrieveTransactionById(id)
      if (!result) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    } catch (error) {
      res.sendStatus(500)
      logger.error(error)
    }
  } else {
    res.sendStatus(400)
  }
}

// get /transactions/account/:id #returns transaction array by account ids
export async function readTransactionByAccount (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    const id: number = req.params.id
    try {
      const result = await retrieveTransactionsByAccountId(id)
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    } catch (error) {
      res.sendStatus(500)
      logger.error(error)
    }
  } else {
    res.sendStatus(400)
  }
}
