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
export function addAccount (body: any): Promise<any> {
  return new Promise(async function (resolve, reject) {
    try {
      if (
        typeof(body.name) === 'string' &&
        typeof(body.owner) === 'number'
      ) {
        const result = await knexInsert(body, 'accounts')
        resolve(result)
      } else {
        resolve(undefined)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle retrieving a singular account by id
export function retrieveAccountById (id: number): Promise<Account> {
  return new Promise(async function (resolve, reject) {
    try {
      let result = await knexSelectById(id, 'accounts')
      if (isAccountArray(result)) {
        if (result.length > 0) {
          resolve(result[0])
        } else {
          resolve(null)
        }
      } else {
        reject('Not account array')
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle the retrieval of all accounts
export function retrieveAccounts (): Promise<Account[]> {
  return new Promise(async function (resolve, reject) {
    try {
      let result = await knexSelectAll('accounts')
      if (isAccountArray(result)) {
        if (result.length > 0) {
          resolve(result)
        } else {
          resolve(null)
        }
      } else {
        reject('Not account array')
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle the retrieval of all accounts by specific owner
export function retrieveAccountByOwner (owner: number): Promise<Account[]> {
  return new Promise(async function (resolve, reject) {
    try {
      let result = await knexSelectByOwner(owner, 'accounts')
      if (isAccountArray(result)) {
        if (result.length > 0) {
          resolve(result)
        } else {
          resolve(null)
        }
      } else {
        reject('Not account array')
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle the updating of account information
export function modifyAccount (accountExists: Account, body: any): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (
      (body.name === undefined || typeof body.name === 'string') &&
      (body.owner === undefined || typeof body.owner === 'number') &&
      (body.deletedAt === undefined || typeof body.deletedAt === 'string')
    ) {
      try {
        const result = await knexUpdateById(body, accountExists.id, 'accounts')
        resolve(false)
      } catch (error) {
        reject(error)
      }
    } else {
      resolve(true)
    }
  })
}

export function removeAccount (id: number): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    try {
      let body = {
        deletedAt: knex.fn.now()
      }
      let result = await knexUpdateById(body, id, 'users')
      resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}

function buildAccount (body: any, baseObj: Account = undefined): Promise<Account> {
  return new Promise(async function (resolve, reject) {
    try {
      if (baseObj === undefined) {
        const accountObject: Account = {
          id: 0,
          name: body.name,
          owner: body.owner,
          deletedAt: '',
          lastUpdated: ''
        }
        resolve(accountObject)
      } else {
        const accountObject: Account = {
          id: baseObj.id,
          name: baseObj.name,
          owner: baseObj.owner,
          deletedAt: baseObj.deletedAt,
          lastUpdated: new Date().toISOString()
        }
        if (body.name !== undefined) {
          accountObject.name = body.name
        }
        if (body.dateCreated !== undefined) {
          accountObject.owner = body.owner
        }
        if (body.deletedAt !== undefined) {
          accountObject.deletedAt = body.deletedAt
        }
        resolve(accountObject)
      }
    } catch (error) {
      reject(error)
    }
  })
}
