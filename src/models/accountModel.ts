import { query } from '../services'

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
    typeof account.deletedAt === 'string' &&
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

// function to handle adding an account
export function addAccount (body: any): Promise<any> {
  return new Promise(async function (resolve, reject) {
    try {
      if (
        typeof(body.name) === 'string' &&
        typeof(body.owner) === 'number'
      ) {
        const sql: string = `INSERT INTO accounts (name, owner) VALUES ('${body.name}', ${body.owner})`
        const result = await query(sql)
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
    const sql: string = `SELECT * FROM accounts WHERE id = '${id}' AND deletedAt = ''`
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
export function modifyAccount (accountExists: Account, body: any): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (
      (body.name === undefined || typeof body.name === 'string') &&
      (body.owner === undefined || typeof body.owner === 'number') &&
      (body.deletedAt === undefined || typeof body.deletedAt === 'string')
    ) {
      try {
        const account = await buildAccount(body, accountExists)
        const sql: string = `UPDATE accounts SET name = '${account.name}', lastUpdated = '${account.lastUpdated}', deletedAt = '${account.deletedAt}' WHERE id = ${account.id} AND owner = ${account.owner}`
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
