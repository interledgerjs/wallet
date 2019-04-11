import { query } from '../services/dbService'

export interface Account {
  id: number,
  name: string,
  owner: number,
  balance: number,
  deletedAt: string,
  lastUpdated: string
}

function isAccount (account: any): account is Account {
  return (
    typeof account.id === 'number' &&
    typeof account.name === 'string' &&
    typeof account.owner === 'number' &&
    typeof account.balance === 'number' &&
    typeof account.deletedAt === 'string' &&
    typeof account.lastUpdated === 'string'
  )
}

function isAccountArray (result: any): result is Account[] {
  let isAccountArray: boolean = true
  if (result.length) {
    result.forEach(function (element) {
      if (!isAccount(element)) {
        isAccountArray = false
      }
    })
  }
  return (
    isAccountArray || result === null
  )
}

// function to handle adding an account
export function addAccount (account: Account): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (isAccount(account)) {
      const sql: string = `INSERT INTO accounts (name, balance, owner) VALUES ('${account.name}', ${account.balance}, ${account.owner})`
      try {
        const result = await query(sql)
        if (isAccountArray(result)) {
          resolve(false)
        } else {
          resolve(true)
        }
      } catch (error) {
        reject(error)
      }
    } else {
      resolve(true)
    }
  })
}

// function to handle retrieving a singular account by id
export function retrieveAccountById (id: number): Promise<Account> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM accounts WHERE id = ${id} AND deletedAt = ''`
    try {
      const result = await query(sql)
      if (isAccountArray(result)) {
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

// function to handle the retrieval of all accounts
export function retrieveAccounts (): Promise<Account[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM accounts WHERE deletedAt = ''`
    try {
      const result = await query(sql)
      if (isAccountArray(result)) {
        if (result.length > 0) {
          resolve(result)
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

// function to handle the retrieval of all accounts by specific owner
export function retrieveAccountByOwner (owner: number): Promise<Account[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM accounts WHERE owner = ${owner} AND deletedAt = ''`
    try {
      const result = await query(sql)
      if (isAccountArray(result)) {
        if (result.length > 0) {
          resolve(result)
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

// function to handle the updating of account information
export function modifyAccount (account: Account): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (isAccount(account)) {
      const sql: string = `UPDATE accounts SET name = '${account.name}', balance = '${account.balance}', lastUpdated = '${account.lastUpdated}', deletedAt = '${account.deletedAt}' WHERE id = ${account.id} AND owner = ${account.owner}`
      try {
        const result = await query(sql)
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
    const sql: string = `UPDATE accounts SET deletedAt = '${new Date().toISOString()}' WHERE id = ${id}`
    try {
      const result = await query(sql)
      resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}
