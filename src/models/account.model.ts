import * as dbFunctions from './db'

export interface Account {
  accountID: number,
  accountName: string,
  ownerUserID: number,
  balance: number,
  last_updated: string
}

function isAccount (account: Account) {
  return (
    typeof account.accountID === 'number' &&
    typeof account.accountName === 'string' &&
    typeof account.ownerUserID === 'number' &&
    typeof account.balance === 'number' &&
    typeof account.last_updated === 'string'
  )
}

// app.post('/users/:id/accounts', account.createAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?

export function createAccount (account: Account, callback: (error: Boolean) => void) {
  console.log('model found')
  if (isAccount) {
    console.log('isAccount returned TRUE')
    console.log(account)
    const sqlquery = `INSERT INTO accounts (accountName, balance, ownerUserID) VALUES ('${account.accountName}', ${account.balance}, ${account.ownerUserID})`
    dbFunctions.query(sqlquery, function (err: object) {
      console.log(err)
      console.log(sqlquery)
      if (err) {
        callback(true)
      } else {
        callback(false)
      }
    })
  } else {
    console.log('isAccount returned FALSE')
    callback(true)
  }
}

// app.get('/users/:id/accounts/:id', account.readAccountById)
  // id as param

export function readAccountByID (account: Account, callback: (error: Boolean, result: Account) => void) {
  if (isAccount) {
    // console.log('isAccount returned TRUE')
    console.log(account)
    const sqlquery = `SELECT * FROM accounts WHERE accountID = ${account.accountID} AND ownerUserID = ${account.ownerUserID}`
    console.log(sqlquery)
    dbFunctions.query(sqlquery, function (err: object, result: Account) {
      console.log(err)
      console.log('result = ' + result)
      if (err) {
        callback(true, null)
      } else {
        callback(false, result)
      }
    })
  } else {
    // console.log('isAccount returned FALSE')
    callback(true, null)
  }
}

// app.get('/accounts', account.readAllAccounts)
  // no required input

export function readAllAccounts (callback: (error: Boolean, result: Account) => void) {
  const sqlquery = `SELECT * FROM accounts`
  dbFunctions.query(sqlquery, function (err: object, result: Account) {
    if (err) {
      callback(true, null)
      // console.log(err)
    } else {
      callback(false, result)
    }
  })
}

// app.get('/users/:id/accounts', account.readAllAccountsByUserID)
  // placeholder comment

export function readAllAccountsByUserID (account: Account, callback: (error: Boolean, result: Account) => void) {
  // console.log('model found')
  const sqlquery = `SELECT * FROM accounts where dbtAccID = '${account.ownerUserID}'`
  dbFunctions.query(sqlquery, function (err: object, result: Account) {
    if (err) {
      callback(true, null)
      // console.log(err)
    } else {
      if (result) {
        callback(false, result)
      } else {
        callback(false, null)
      }
    }
  })
}

// app.put('/users/:id/accounts/:id', account.updateAccount)
  // id as param, body.accountName, body.ownerUserID?

// app.delete('/users/:id/accounts/:id', account.deleteAccount)
  // id as param
