import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as account from './controllers/account'
import * as jwtController from './controllers/jwtcontroller'
import * as transaction from './controllers/transaction'
import * as user from './controllers/user'
import * as middleware from './middleware'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.post('/transaction', middleware.verifyToken, transaction.addTransaction)
  // body.transID, body.dbtAccID, body.crdtAccID, body.amount
app.get('/transactions', transaction.transactions)
  // no required input
app.get('/transaction/:id/', middleware.validateData, transaction.getTransaction)
  // id as param
app.put('/transaction/:id', middleware.verifyToken, transaction.updateTransaction)
  // id as param, body.dbtAccID, body.crdtAccID, body.amount
app.delete('/transaction/:id', middleware.verifyToken, transaction.delTransaction)
  // id as param

app.post('/account', middleware.verifyToken, account.addAccount)
  // body.accountID?, body.accountName?, body.ownerUserID?
app.get('/accounts', account.accounts)
  // no required input
app.get('/account/:id', middleware.validateData, account.getAccount)
  // id as param
app.put('/account/:id', middleware.verifyToken, account.updateAccount)
  // id as param, body.accountName, body.ownerUserID?
app.delete('/account/:id', middleware.verifyToken, account.delAccount)
  // id as param

app.post('/user', user.createUser)

app.get('/user', user.readUser)
  // no required input
app.get('/user/id/:id', user.readUserByID)
  // id as param
app.get('/user/username/:username', user.readUserByUserName)
// userName as param
app.get('/login/:userName', user.login)
  // userName as param, body.password
app.put('/user/:id', middleware.verifyToken, user.updateuser)
  // id as param, body.userName?, body.active?, body.password?
app.delete('/user/:id', middleware.verifyToken, user.deluser)
  // id as param

app.get('/getToken', jwtController.genToken)

app.all('*', (req, res) => {
  res.sendStatus(404)
})

if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log('server running on port %d', process.env.PORT)
  })
}
