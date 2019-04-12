import { Request, Response } from 'express'
import { Transaction, addTransaction, retrieveTransactions, retrieveTransactionById, retrieveTransactionsByAccountId } from '../models/transactionModel'

// post /transactions #adds new transaction to table
export async function createTransaction (req: Request, res: Response) {
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
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}

// get /transactions #returns all transactions
export async function readTransactions (req: Request, res: Response) {

  try {
    const result = await retrieveTransactions()
    if (result.length === 0) {
      res.sendStatus(404)
    } else {
      res.send(result)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// get /transactions/id/:id #returns single transaction by id
export async function readTransactionById (req: Request, res: Response) {
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
    }
  } else {
    res.sendStatus(400)
  }
}

// get /transactions/account/:id #returns transaction array by account ids
export async function readTransactionByAccount (req: Request, res: Response) {
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
    }
  } else {
    res.sendStatus(400)
  }
}
