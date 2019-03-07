import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as account from './controllers/account.controller'
// import * as jwtController from './controllers/jwtcontroller'
import * as transaction from './controllers/transaction'
import * as user from './controllers/user'

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

app.post('/users/:userid/accounts', account.createAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?
app.get('/users/:userid/accounts/:accountid', account.readAccountByID)
  // id's as param
app.get('/users/:userid/accounts', account.readAllAccountsByUserID)

// app.post('/user', user.createUser)
app.get('/users', user.readUser)
  // no required input
app.get('/users/id/:id', user.readUserByID)
  // id as param
app.get('/users/username/:username', user.readUserByUserName)
  // userName as param
  // app.post('/user', middleware.verifyToken, user.addUser)
//   // body.userName?, body.password?, body.active?
// app.get('/users', user.users)
//   // no required input
// app.get('/user/:id', middleware.validateData, user.getuser)
//   // id as param
// app.get('/login/:userName', user.login)
  // userName as param, body.password
// app.put('/user/:id', middleware.verifyToken, user.updateuser)
  // id as param, body.userName?, body.active?, body.password?
// app.delete('/user/:id', middleware.verifyToken, user.deluser)
  // id as param
app.post('/users', user.createUser)
  // body.userName?, body.password?

// app.get('/getToken', jwtController.genToken)

app.all('*', (req, res) => {
  res.sendStatus(404)
})

if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log('server running on port %d', process.env.PORT)
  })
}
