import * as dbFunctions from '../services/dbService'

export interface Transaction {
  id: number,
  debitAccount: number,
  creditAccount: number,
  amount: number,
  date: string
}

export function isTransaction (transaction: any): transaction is Transaction {
  return (
    typeof transaction.id === 'number' &&
    typeof transaction.debitAccount === 'number' &&
    typeof transaction.creditAccount === 'number' &&
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
      if (transaction.id !== -1) {
        sql = `INSERT INTO transactions (id, debitAccount, creditAccount, amount, date) VALUES ('${transaction.id}', '${transaction.debitAccount}', '${transaction.creditAccount}', '${transaction.amount}', '${transaction.date}')`
      } else {
        sql = `INSERT INTO transactions (debitAccount, creditAccount, amount, date) VALUES ('${transaction.debitAccount}', '${transaction.creditAccount}', '${transaction.amount}', '${transaction.date}')`
      }
      try {
        const result = await dbFunctions.query(sql)
        if (isTransactionArray(result)) {
          resolve(false)
        } else {
          reject(true)
        }
      } catch (error) {
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
export function retrieveTransactionById (id: number): Promise<Transaction> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM transactions where id = '${id}'`

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
export function retrieveTransactionsByAccountId (id: number): Promise<Transaction[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM transactions where (debitAccount = '${id}' OR creditAccount = '${id}')`

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
