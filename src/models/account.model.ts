import * as dbFunctions from './db'

export interface Account {
  accountId: number,
  accountName: string,
  ownerUserId: number,
  balance: number,
  last_updated: string
}

function isAccount (account: Account) {
  return (
    typeof account.accountId === 'number' &&
    typeof account.accountName === 'string' &&
    typeof account.ownerUserId === 'number' &&
    typeof account.balance === 'number' &&
    typeof account.last_updated === 'string'
  )
}

// app.post('/users/:id/accounts', account.createAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?

export function createAccount (account: Account, callback: (error: Boolean, account: Account) => void) {
  if (isAccount) {
    const sqlquery = `INSERT INTO accounts (accountName, balance, ownerUserID) VALUES ('${account.accountName}', ${account.balance}, ${account.ownerUserId})`
    dbFunctions.query(sqlquery, function (err: object) {
      console.log(err)
      if (err) {
        callback(true, account)
      } else {
        callback(false, account)
      }
    })
  } else {
    callback(true, account)
  }
}

// app.get('/accounts', account.readAllAccounts)
  // no required input

// app.get('/users/:id/accounts', account.readAllAccountsByUserId)
  // placeholder comment

// app.get('/users/:id/accounts/:id', account.readAccount)
  // id as param

// app.put('/users/:id/accounts/:id', account.updateAccount)
  // id as param, body.accountName, body.ownerUserID?

// app.delete('/users/:id/accounts/:id', account.deleteAccount)
  // id as param
