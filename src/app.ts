import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
// import * as jwtController from './controllers/jwtcontroller'
import * as transaction from './controllers/transaction'
import * as account from './controllers/account'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.post('/transactions', transaction.createTransaction)
  // body.transID?, body.dbtAccID, body.crdtAccID, body.amount
app.get('/transactions/', transaction.readTransactions)
// no required input
app.get('/transactions/id/:id/', transaction.readTransactionByID)
// id as param
app.get('/transactions/account/:accountID/', transaction.readTransactionByAccount)
// account id as param

app.post('/users/:id/accounts', account.createAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?
app.get('/accounts', account.readAllAccounts)
  // no required input
app.get('/users/:id/accounts', account.readAllAccountsByUserId)

app.get('/users/:id/accounts/:id', account.readAccount)
  // id as param
app.put('/users/:id/accounts/:id', account.updateAccount)
  // id as param, body.accountName, body.ownerUserID?
app.delete('/users/:id/accounts/:id', account.deleteAccount)
  // id as param

  // app.post('/user', middleware.verifyToken, user.addUser)
//   // body.userName?, body.password?, body.active?
// app.get('/users', user.users)
//   // no required input
// app.get('/user/:id', middleware.validateData, user.getuser)
//   // id as param
// app.get('/login/:userName', user.login)
//   // userName as param, body.password
// app.put('/user/:id', middleware.verifyToken, user.updateuser)
//   // id as param, body.userName?, body.active?, body.password?
// app.delete('/user/:id', middleware.verifyToken, user.deluser)
//   // id as param
// app.get('/user/userName/:userName', middleware.validateData, user.getUserByUserName)
// // userName as param

// app.get('/getToken', jwtController.genToken)

app.all('*', (req, res) => {
  res.sendStatus(404)
})

if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log('server running on port %d', process.env.PORT)
  })
}
