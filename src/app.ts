import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as account from './controllers/account'
import * as exchange from './controllers/exchangeController'
import * as jwtController from './controllers/jwtcontroller'
import * as transaction from './controllers/transaction'
import * as user from './controllers/user'
import * as dbFunctions from './db'
import * as middleware from './middleware'
import * as jwt from 'jsonwebtoken'

const app = express()
app.set('port', 3000)
app.use(bodyParser.json())

dbFunctions.initialise()

// temporary user endpoints
import * as tempuser from './password'
// temporary user login
app.get('/login/:userName/:password', tempuser.login)
// creates a user and hashes user password
app.post('/users', tempuser.addUser)

app.get('/transactions', transaction.transactions)
  // no required input
app.get('/transaction/:id/', transaction.getTransaction)
  // id as param
app.post('/transaction', middleware.verifyToken, transaction.addTransaction)
  // body.transID, body.dbtAccID, body.crdtAccID, body.amount
app.delete('/transaction/:id', middleware.verifyToken, transaction.delTransaction)
  // id as param
app.put('/transaction/:id', middleware.verifyToken, transaction.updateTransaction)
  // id as param, body.dbtAccID, body.crdtAccID, body.amount

app.get('/accounts', account.accounts)
  // no required input
app.get('/account/:id', account.getAccount)
  // id as param
app.post('/account', middleware.verifyToken, account.addAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?
app.delete('/account/:id', middleware.verifyToken, account.delAccount)
  // id as param
app.put('/account/:id', middleware.verifyToken, account.updateAccount)
  // id as param, body.accountName, body.ownerUserID?

app.get('/users', user.users)
  // no required input
app.get('/user/:id', user.getuser)
  // id as param
app.post('/user', middleware.verifyToken, user.adduser)
  // body.userName?, body.password?, body.active?
app.delete('/user/:id', middleware.verifyToken, user.deluser)
  // id as param
app.put('/user/:id', middleware.verifyToken, user.updateuser)
app.get('/users/id/:userID', users.getUserByUserId)
app.get('/login/:userName', user.login)
  // id as param, body.userName?, body.active?, body.password?

app.get('/getToken', jwtController.genToken)

app.get('/exchange', exchange.getRates)

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log('server running on port %d', app.get('port'))
  })
}
module.exports = app
