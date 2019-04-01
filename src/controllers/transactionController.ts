import { Request, Response } from 'express'
import { Transaction, addTransaction, retrieveTransactions, retrieveTransactionByID, retrieveTransactionsByAccID } from '../models/transactionModel'

// post /transactions #adds new transaction to table
export async function createTransaction (req: Request, res: Response) {
  if (
    req.body.dbtAccID && typeof req.body.dbtAccID === 'number' &&
    req.body.crdtAccID && typeof req.body.crdtAccID === 'number' &&
    req.body.amount && typeof req.body.amount === 'number'
  ) {
    const transObject: Transaction = {
      transID: -1,
      dbtAccID: req.body.dbtAccID,
      crdtAccID: req.body.crdtAccID,
      amount: req.body.amount,
      date: new Date().toISOString()
    }
    if (req.body.transID && typeof req.body.dbtAccID === 'number') {
      transObject.transID = req.body.transID
    }

    try {
      const failure = await addTransaction(transObject)
      if (!failure) {
        res.send('Transaction added')
      }
    } catch (error) {
      // console.log(error)
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
export async function readTransactionByID (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    const transID: number = req.params.id

    try {
      const result = await retrieveTransactionByID(transID)
      if (!result) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    } catch (error) {
      // console.log(error)
      res.status(500).send('Unable to retrieve transaction')
    }
  } else {
    res.status(400).send('Bad request')
  }
}

// get /transactions/account/:accountID #returns transaction array by account ids
export async function readTransactionByAccount (req: Request, res: Response) {
  if (
    req.params.accountID &&
    !isNaN(parseInt(req.params.accountID, 10))
  ) {
    // console.log(`value is '${req.params.accountID}'`)
    const accountID: number = req.params.accountID

    try {
      const result = await retrieveTransactionsByAccID(accountID)
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    } catch (error) {
      // console.log(error)
      res.status(500).send('Unable to retrieve transactions')
    }
  } else {
    res.status(400).send('Bad request')
  }
}
