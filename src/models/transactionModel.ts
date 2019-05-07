import { query } from '../services'

export interface Transaction {
  id: number,
  debitAccountId: number,
  creditAccountId: number,
  amount: number,
  date: string
}

export function isTransaction (transaction: any): transaction is Transaction {
  return (
    typeof transaction.id === 'number' &&
    typeof transaction.debitAccountId === 'number' &&
    typeof transaction.creditAccountId === 'number' &&
    typeof transaction.amount === 'number' &&
    typeof transaction.date === 'string'
  )
}

export function isTransactionArray (result: any): result is Transaction[] {
  let isTransactionArray: boolean = true
  result.forEach(function (element: any) {
    if (!isTransaction(element)) {
      isTransactionArray = false
    }
  })
  return (
    isTransactionArray || result === null
  )
}

// function to handle adding transactions
export function addTransaction (body: any): Promise<boolean> {
  return new Promise(async function (resolve: any, reject) {
    try {
      const transaction = await buildTransaction(body)
      if (transaction && isTransaction(transaction)) {
        const sql: string = `INSERT INTO transactions (debitAccountId, creditAccountId, amount, date) VALUES ('${transaction.debitAccountId}', '${transaction.creditAccountId}', '${transaction.amount}', '${transaction.date}')`
        const result = await query(sql)
        resolve(false)
      } else {
        resolve(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle getting all transactions
export function retrieveTransactions (): Promise<Transaction[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM transactions`
    try {
      const result = await query(sql)
      if (isTransactionArray(result)) {
        resolve(result)
      } else {
        reject('Not transaction array')
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
      const result = await query(sql)
      if (isTransactionArray(result)) {
        if (result.length > 0) {
          resolve(result[0])
        } else {
          resolve(null)
        }
      } else {
        reject('Not transaction array')
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle getting transactions by account id
export function retrieveTransactionsByAccountId (id: number): Promise<Transaction[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM transactions where (debitAccountId = '${id}' OR creditAccountId = '${id}')`
    try {
      const result = await query(sql)
      if (isTransactionArray(result)) {
        resolve(result)
      } else {
        reject('Not transaction array')
      }
    } catch (error) {
      reject(error)
    }
  })
}

function buildTransaction (body: any, baseObj: Transaction = undefined): Promise<Transaction> {
  return new Promise(async function (resolve, reject) {
    if (baseObj === undefined) {
      const transactionObject: Transaction = {
        id: -1,
        debitAccountId: body.debitAccountId,
        creditAccountId: body.creditAccountId,
        amount: body.amount,
        date: new Date().toISOString()
      }
      resolve(transactionObject)
    }
  })
}
