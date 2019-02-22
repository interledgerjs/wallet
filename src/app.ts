import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as account from './controllers/account'
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

app.get('/transactions', middleware.validateData, transaction.transactions)
  // no required input
app.get('/transaction/:id/', middleware.validateData, transaction.getTransaction)
  // id as param
app.post('/transaction', middleware.verifyToken, middleware.validateData, transaction.addTransaction)
  // body.transID, body.dbtAccID, body.crdtAccID, body.amount
app.delete('/transaction/:id', middleware.verifyToken, middleware.validateData, transaction.delTransaction)
  // id as param
app.put('/transaction/:id', middleware.verifyToken, middleware.validateData, transaction.updateTransaction)
  // id as param, body.dbtAccID, body.crdtAccID, body.amount

app.get('/accounts', middleware.validateData, account.accounts)
  // no required input
app.get('/account/:id', middleware.validateData, account.getAccount)
  // id as param
app.post('/account', middleware.verifyToken, middleware.validateData, account.addAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?
app.delete('/account/:id', middleware.verifyToken, middleware.validateData, account.delAccount)
  // id as param
app.put('/account/:id', middleware.verifyToken, middleware.validateData, account.updateAccount)
  // id as param, body.accountName, body.ownerUserID?

app.get('/users', middleware.validateData, user.users)
  // no required input
app.get('/user/:id', middleware.validateData, user.getuser)
  // id as param
app.post('/user', middleware.verifyToken, middleware.validateData, user.adduser)
  // body.userName?, body.password?, body.active?
app.delete('/user/:id', middleware.verifyToken, middleware.validateData, user.deluser)
  // id as param
app.put('/user/:id', middleware.verifyToken, middleware.validateData, user.updateuser)
app.get('/login/:userName', middleware.validateData, user.login)
  // id as param, body.userName?, body.active?, body.password?

app.get('/getToken', jwtController.genToken)

app.all('*', (req, res) => {
  res.sendStatus(404)
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log('server running on port %d', app.get('port'))
  })
}
module.exports = app
