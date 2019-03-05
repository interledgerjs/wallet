export interface Account {
  accountId: number,
  accountName: string,
  ownerUserId: number,
  balance: number,
  last_updated: string
}

// app.post('/users/:id/accounts', middleware.verifyToken, account.createAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?

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
