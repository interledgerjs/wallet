import { Request, Response } from 'express'
import * as transaction from '../models/transaction'

<<<<<<< HEAD
// post /transaction #adds new transaction to table
export function createTransaction (req: Request, res: Response) {
  const transObject: transaction.Transaction = {
    transID: -1,
    dbtAccID: req.body.dbtAccID,
    crdtAccID: req.body.crdtAccID,
    amount: req.body.amount,
    date: new Date().toISOString()
  }
  transaction.createTransaction(transObject, function (error) {
    if (error) {
      res.status(500).send('Unable to add transaction')
    } else {
      res.send('Transaction added')
    }
  })
}

// get /transaction #returns all transactions
=======
// post /transactions #adds new transaction to table
export function createTransaction (req: Request, res: Response) {
  if (
    req.body.dbtAccID && typeof req.body.dbtAccID === 'number' &&
    req.body.crdtAccID && typeof req.body.crdtAccID === 'number' &&
    req.body.amount && typeof req.body.amount === 'number'
  ) {
    const transObject: transaction.Transaction = {
      transID: -1,
      dbtAccID: req.body.dbtAccID,
      crdtAccID: req.body.crdtAccID,
      amount: req.body.amount,
      date: new Date().toISOString()
    }
    if (req.body.transID && typeof req.body.dbtAccID === 'number') {
      transObject.transID = req.body.transID
    }
    transaction.createTransaction(transObject, function (error) {
      if (error) {
        res.status(500).send('Unable to add transaction')
      } else {
        res.send('Transaction added')
      }
    })
  } else {
    res.status(400).send('Bad request')
  }
}

// get /transactions #returns all transactions
>>>>>>> origin/transactiontesting
export function readTransactions (req: Request, res: Response) {
  transaction.readTransactions(function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve transactions')
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
}

<<<<<<< HEAD
// get /transaction/id/:id #returns single transaction by id
export function readTransactionByID (req: Request, res: Response) {
  const transID: number = req.params.id
  transaction.readTransactionByID(transID, function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve transaction')
    } else {
      if (!result) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
}

// get /transaction/id/:id #returns transaction array by account ids
export function readTransactionByAccount (req: Request, res: Response) {
  const accountID: number = req.params.accountID
  transaction.readTransactionsByAccID(accountID, function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve transactions')
    } else {
      if (!result) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
=======
// get /transactions/id/:id #returns single transaction by id
export function readTransactionByID (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    const transID: number = req.params.id
    transaction.readTransactionByID(transID, function (error, result) {
      if (error) {
        res.status(500).send('Unable to retrieve transaction')
      } else {
        if (!result) {
          res.sendStatus(404)
        } else {
          res.send(result)
        }
      }
    })
  } else {
    res.status(400).send('Bad request')
  }
}

// get /transactions/account/:accountID #returns transaction array by account ids
export function readTransactionByAccount (req: Request, res: Response) {
  if (
    req.params.accountID &&
    !isNaN(parseInt(req.params.accountID, 10))
  ) {
    console.log(`value is '${req.params.accountID}'`)
    const accountID: number = req.params.accountID
    transaction.readTransactionsByAccID(accountID, function (error, result) {
      if (error) {
        res.status(500).send('Unable to retrieve transactions')
      } else {
        if (!result) {
          res.sendStatus(404)
        } else {
          res.send(result)
        }
      }
    })
  } else {
    res.status(400).send('Bad request')
  }
>>>>>>> origin/transactiontesting
}
