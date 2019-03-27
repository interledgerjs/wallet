import * as dbFunctions from './db'

export interface Transaction {
  transID: number,
  dbtAccID: number,
  crdtAccID: number,
  amount: number,
  date: string
}

export function isTransaction (transaction: any): transaction is Transaction {
  return (
    typeof transaction.transID === 'number' &&
    typeof transaction.dbtAccID === 'number' &&
    typeof transaction.crdtAccID === 'number' &&
    typeof transaction.amount === 'number' &&
    typeof transaction.date === 'string'
  )
}

export function isTransactionArray (result: any): result is Transaction[] {
  let isTransactionArray: boolean = true
  result.forEach(function (element) {
    if (!isTransaction(element)) {
      isTransactionArray = false
    }
  })
  return (
    isTransactionArray || result === null
  )
}

// function to handle adding transactions
export function addTransaction (transaction: Transaction): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (isTransaction(transaction)) {
      let sql: string
      if (transaction.transID !== -1) {
        sql = `INSERT INTO transactions (transID, dbtAccID, crdtAccID, amount, date) VALUES ('${transaction.transID}', '${transaction.dbtAccID}', '${transaction.crdtAccID}', '${transaction.amount}', '${transaction.date}')`
      } else {
        sql = `INSERT INTO transactions (dbtAccID, crdtAccID, amount, date) VALUES ('${transaction.dbtAccID}', '${transaction.crdtAccID}', '${transaction.amount}', '${transaction.date}')`
      }
      try {
        const result = await dbFunctions.query(sql)
        if (isTransactionArray(result)) {
          resolve(false)
        } else {
          reject(true)
        }
      } catch (error) {
        console.log(error)
        console.log('model catch')
        reject(error)
      }
    } else {
      resolve(true)
    }
  })
}

// function to handle getting all transactions
export function retrieveTransactions (): Promise<Transaction[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM transactions`

    try {
      const result = await dbFunctions.query(sql)
      if (isTransactionArray(result)) {
        resolve(result)
      } else {
        reject(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle getting transactions by id
export function retrieveTransactionByID (transID: number): Promise<Transaction> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM transactions where transID = '${transID}'`

    try {
      const result = await dbFunctions.query(sql)
      if (isTransactionArray(result)) {
        if (result.length > 0) {
          resolve(result[0])
        } else {
          resolve(null)
        }
      } else {
        reject(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle getting transactions by account id
export function retrieveTransactionsByAccID (AccountID: number): Promise<Transaction[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM transactions where (dbtAccID = '${AccountID}' OR crdtAccID = '${AccountID}')`

    try {
      const result = await dbFunctions.query(sql)
      if (isTransactionArray(result)) {
        resolve(result)
      } else {
        reject(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}
