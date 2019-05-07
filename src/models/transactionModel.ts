import { knexInsert, knexSelectAll, knexSelectById, knexSelectTransactionByEitherAccount } from '../services'

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
      // const transaction = await buildTransaction(body) // planned for deprication; replace with transaction proto-object typeguard
      if (body) { // && isTransaction(transaction)) { // planned for deprication; replace with transaction proto-object typeguard
        // const sql: string = `INSERT INTO transactions (debitAccountId, creditAccountId, amount, date) VALUES ('${transaction.debitAccountId}', '${transaction.creditAccountId}', '${transaction.amount}', '${transaction.date}')` // planned for deprication; replace with transaction proto-object typeguard
        // const result = await query(sql) // planned for deprication; replace with transaction proto-object typeguard
        let result = await knexInsert(body, 'transactions')
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
    // const sql: string = `SELECT * FROM transactions`
    try {
      // const result = await query(sql)
      let result = await knexSelectAll('transactions')
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
    // const sql: string = `SELECT * FROM transactions where id = '${id}'`
    try {
      // const result = await query(sql)
      let result = await knexSelectById(id, 'transactions')
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
    // const sql: string = `SELECT * FROM transactions where (debitAccountId = '${id}' OR creditAccountId = '${id}')`
    try {
      // const result = await query(sql)
      let result = await knexSelectTransactionByEitherAccount(id, 'transactions')
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

function buildTransaction (body: any, baseObj: Transaction = undefined): Promise<Transaction> {
  return new Promise(async function (resolve, reject) {
    try {
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
    } catch (error) {
      reject(error)
    }
  })
}
