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
export async function addTransaction (body: any): Promise<boolean> {
  if (body) {
    let result = await knexInsert(body, 'transactions')
    return (false)
  } else {
    return (true)
  }
}

// function to handle getting all transactions
export async function retrieveTransactions (): Promise<Transaction[]> {
  let result = await knexSelectAll('transactions')
  if (isTransactionArray(result)) {
    return (result)
  } else {
    throw new Error('Not transaction array')
  }
}

// function to handle getting transactions by id
export async function retrieveTransactionById (id: number): Promise<Transaction> {
  let result = await knexSelectById(id, 'transactions')
  if (isTransactionArray(result)) {
    if (result.length > 0) {
      return (result[0])
    } else {
      return (null)
    }
  } else {
    throw new Error('Not transaction array')
  }
}

// function to handle getting transactions by account id
export async function retrieveTransactionsByAccountId (id: number): Promise<Transaction[]> {
  let result = await knexSelectTransactionByEitherAccount(id, 'transactions')
  if (isTransactionArray(result)) {
    return (result)
  } else {
    throw new Error('Not transaction array')
  }
}

function buildTransaction (body: any, baseObj: Transaction = undefined): Transaction {
  if (baseObj === undefined) {
    const transactionObject: Transaction = {
      id: -1,
      debitAccountId: body.debitAccountId,
      creditAccountId: body.creditAccountId,
      amount: body.amount,
      date: new Date().toISOString()
    }
    return (transactionObject)
  }
}
