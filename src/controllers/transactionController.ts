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
        res.send('Transaction added')
      }
    } catch (error) {
      res.status(500).send('unable to add transaction')
    }
  } else {
    res.status(400).send('Bad request')
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
    res.status(500).send('Unable to retrieve transactions')
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
      res.status(500).send('Unable to retrieve transaction')
    }
  } else {
    res.status(400).send('Bad request')
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
      res.status(500).send('Unable to retrieve transactions')
    }
  } else {
    res.status(400).send('Bad request')
  }
}
