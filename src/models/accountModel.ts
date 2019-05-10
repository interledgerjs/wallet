import { knexInsert, knexSelectById, knexSelectAll, knexSelectByOwner, knexUpdateById } from '../services'
import * as knex from '../../database/knex'
import { retrieveTransactionsByAccountId } from './'

export interface Account {
  id: number,
  name: string,
  owner: number,
  deletedAt: string,
  lastUpdated: string
}

export interface DisplayAccount extends Account {
  balance: number
}

function isAccount (account: any): account is Account {
  return (
    typeof account.id === 'number' &&
    typeof account.name === 'string' &&
    typeof account.owner === 'number' &&
    (typeof account.deletedAt === 'string' || typeof account.deletedAt === 'object') &&
    typeof account.lastUpdated === 'string'
  )
}

function isAccountArray (result: any): result is Account[] {
  let isAccountArray: boolean = true
  if (result.length) {
    result.forEach(function (element: any) {
      if (!isAccount(element)) {
        isAccountArray = false
      }
    })
  }
  return (
    isAccountArray || result === null
  )
}

function makeDisplayAccount (account: Account): Promise<DisplayAccount> {
  return new Promise(async function (resolve, reject) {
    try {
      let displayObject: any = account
      displayObject.balance = await calculateBalance(account.id)
      resolve(displayObject)
    } catch (error) {
      reject(error)
    }
  })
}

export function calculateBalance (accountId: number): Promise<number> {
  return new Promise(async function (resolve, reject) {
    let balance: number = 0
    try {
      const transactions = await retrieveTransactionsByAccountId(accountId)
      transactions.forEach(element => {
        if (element.debitAccountId === accountId) {
          balance -= element.amount
        } else {
          balance += element.amount
        }
      })
      resolve(balance)
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle adding an account
export async function addAccount (body: any): Promise<DisplayAccount> {
  const result = (await knexInsert(body, 'accounts'))[0]
  const displayObject = makeDisplayAccount(result)
  return(displayObject)
}

// function to handle retrieving a singular account by id
export async function retrieveAccountById (id: number): Promise<DisplayAccount> {
  let result = (await knexSelectById(id, 'accounts'))[0]
  if (!result) {
    return undefined
  }
  if (isAccount(result)) {
    const displayAccount = makeDisplayAccount(result)
    return(displayAccount)
  } else {
    throw new Error('Not an account')
  }
}

// function to handle the retrieval of all accounts
export async function retrieveAccounts (): Promise<Account[]> {
  let result = await knexSelectAll('accounts')
  if (isAccountArray(result)) {
    if (result.length > 0) {
      return(result)
    } else {
      return(null)
    }
  } else {
    throw new Error('Not an account array')
  }
}

// function to handle the retrieval of all accounts by specific owner
export async function retrieveAccountByOwner (owner: number): Promise<Account[]> {
  let result = await knexSelectByOwner(owner, 'accounts')
  if (isAccountArray(result)) {
    if (result.length > 0) {
      return(result)
    } else {
      return(null)
    }
  } else {
    throw new Error('Not an account array')
  }
}

// function to handle the updating of account information
export async function modifyAccount (accountExists: Account, body: any): Promise<DisplayAccount> {
  const result = (await knexUpdateById(body, accountExists.id, 'accounts'))[0]
  const displayAccount = makeDisplayAccount(result)
  return(displayAccount)
}

export async function removeAccount (id: number): Promise<DisplayAccount> {
  let body = {
    deletedAt: knex.fn.now()
  }
  let result = (await knexUpdateById(body, id, 'accounts'))[0]
  const displayAccount = makeDisplayAccount(result)
  return(displayAccount)
}
