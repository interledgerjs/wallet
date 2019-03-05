import * as dbFunctions from './db'

export interface Transaction {
  transID: number,
  dbtAccID: number,
  crdtAccID: number,
  amount: number,
  date: string
}

function isTransaction (transaction: any): transaction is Transaction {
  return (
    typeof transaction.transID === 'number' &&
    typeof transaction.dbtAccID === 'number' &&
    typeof transaction.crdtAccID === 'number' &&
    typeof transaction.amount === 'number' &&
    typeof transaction.date === 'string'
  )
}

// function to handle adding transactions
export function createTransaction (transaction: Transaction, callback: (error: Boolean) => void) {
  if (isTransaction(transaction)) {
    const sql = `INSERT INTO transactions (dbtAccID, crdtAccID, amount, date) VALUES ('${transaction.dbtAccID}', '${transaction.crdtAccID}', '${transaction.amount}', '${transaction.date}')`
    dbFunctions.query(sql, function (err: object) {
      if (err) {
        callback(true)
        console.log(err)
      } else {
        callback(false)
      }
    })
  } else {
    callback(true)
  }
}

// function to handle getting all transactions
export function getTransactions (callback: (error: Boolean, result: Transaction[] | null) => void) {
  const sql = `SELECT * FROM transactions`
  dbFunctions.query(sql, function (err: object, result: Transaction[]) {
    if (err) {
      callback(true, null)
      console.log(err)
    } else {
      callback(false, result)
    }
  })
}

// function to handle getting transactions by id
export function getTransactionByID (transID: number, callback: (error: Boolean, result: Transaction | null) => void) {
  const sql = `SELECT * FROM transactions where transID = '${transID}'`
  dbFunctions.query(sql, function (err: object, result: Transaction[]) {
    if (err) {
      callback(true, null)
      console.log(err)
    } else {
      if (result.length > 0) {
        callback(false, result[0])
      } else {
        callback(false, null)
      }
    }
  })
}

// function to handle getting transactions by account id
export function getTransactionsByAccID (AccountID: number, callback: (error: Boolean, result: Transaction[] | null) => void) {
  const sql = `SELECT * FROM transactions where (dbtAccID = '${AccountID}' OR crdtAccID = '${AccountID}')`
  dbFunctions.query(sql, function (err: object, result: Transaction[]) {
    if (err) {
      callback(true, null)
      console.log(err)
    } else {
      if (result.length > 0) {
        callback(false, result)
      } else {
        callback(false, null)
      }
    }
  })
}
