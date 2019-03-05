import * as dbFunctions from './db'

export interface Account {
  accountId: number,
  accountName: string,
  ownerUserId: number,
  balance: number,
  last_updated: string
}

// app.post('/users/:id/accounts', middleware.verifyToken, account.createAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?

export function createAccount (account: Account, callback: (error: Boolean, account: Account) => void) {
  const sql = `INSERT INTO accounts (accountName, balance, ownerUserID) VALUES ('${account.accountName}', ${account.balance}, ${account.ownerUserId})`
  dbFunctions.query(sql, function (err: object) {
    console.log(err)
    if (err) {
      callback(true, account)
    } else {
      callback(false, account)
    }
  })
}

// app.get('/accounts', account.readAllAccounts)
  // no required input

// app.get('/users/:id/accounts', account.readAllAccountsByUserId)
  // placeholder comment

// app.get('/users/:id/accounts/:id', middleware.validateData, account.readAccount)
  // id as param

// app.put('/users/:id/accounts/:id', middleware.verifyToken, account.updateAccount)
  // id as param, body.accountName, body.ownerUserID?

// app.delete('/users/:id/accounts/:id', middleware.verifyToken, account.deleteAccount)
  // id as param
