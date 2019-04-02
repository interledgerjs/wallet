import { query } from './db'

export interface Account {
  accountID: number,
  accountName: string,
  ownerUserID: number,
  balance: number,
  deletedAt: string,
  lastUpdated: string
}

function isAccount (account: Account) {
  return (
    typeof account.accountID === 'number' &&
    typeof account.accountName === 'string' &&
    typeof account.ownerUserID === 'number' &&
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
      const sql: string = `INSERT INTO accounts (accountName, balance, ownerUserID) VALUES ('${account.accountName}', ${account.balance}, ${account.ownerUserID})`
      try {
        const result = await query(sql)
        if (isAccountArray(result)) {
          resolve(false)
        } else {
          console.log('x')
          resolve(true)
        }
      } catch (error) {
        reject(error)
      }
    } else {
      console.log('y')
      resolve(true)
    }
  })
}

// function to handle retrieving a singular account by AccountID
export function retrieveAccountByID (id: number): Promise<Account> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM accounts WHERE accountID = ${id}`
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
export function retrieveAllAccounts (): Promise<Account[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM accounts`
    try {
      const result = await query(sql)
      console.log(result)
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

// function to handle list of accounts owned by userID
export function retrieveAccountsByUserID (userID: number): Promise<Account[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM accounts WHERE ownerUserID = ${userID}`
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
      const sql: string = `UPDATE accounts SET accountName = '${account.accountName}', balance = '${account.balance}', lastUpdated = '${account.lastUpdated}', deletedAt = '${account.deletedAt}' WHERE accountID = ${account.accountID} AND ownerUserID = ${account.ownerUserID}`
      console.log(sql)
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

// funcion to handle the deletion of accounts
export function removeAccount (accountID: number): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `DELETE FROM accounts WHERE accountID = ${accountID}`
    try {
      const result = await query(sql)
      resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}
