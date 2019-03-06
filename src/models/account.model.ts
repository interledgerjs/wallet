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

export function createAccount (account: Account, callback: (error: Boolean) => void) {
  if (isAccount) {
    // console.log('isAccount returned TRUE')
    console.log(account)
    const sqlquery = `INSERT INTO accounts (accountName, balance, ownerUserID) VALUES ('${account.accountName}', ${account.balance}, ${account.ownerUserId})`
    dbFunctions.query(sqlquery, function (err: object) {
      // console.log(err)
      if (err) {
        callback(true)
      } else {
        callback(false)
      }
    })
  } else {
    // console.log('isAccount returned FALSE')
    callback(true)
  }
}

// app.get('/users/:id/accounts/:id', account.readAccount)
  // id as param

// app.get('/accounts', account.readAllAccounts)
  // no required input

// app.get('/users/:id/accounts', account.readAllAccountsByUserId)
  // placeholder comment

// app.put('/users/:id/accounts/:id', account.updateAccount)
  // id as param, body.accountName, body.ownerUserID?

// app.delete('/users/:id/accounts/:id', account.deleteAccount)
  // id as param
