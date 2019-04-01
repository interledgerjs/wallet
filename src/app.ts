import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as account from './controllers/account.controller'
import * as transaction from './controllers/transaction'
import * as user from './controllers/user'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.post('/transactions', transaction.createTransaction) // body.transID?, body.dbtAccID, body.crdtAccID, body.amount
app.get('/transactions/', transaction.readTransactions) // no required input
app.get('/transactions/id/:id/', transaction.readTransactionByID) // id as param
app.get('/transactions/account/:accountID/', transaction.readTransactionByAccount) // account id as param

app.post('/accounts', account.createAccount) // body.balance , body.accountName, body.ownerUserID
app.get('/accounts/id/:accountid', account.readAccountByID) // id's as param
app.get('/accounts/userid/:userid/', account.readAllAccountsByUserID)

app.get('/accounts', account.readAllAccounts) // no required input
app.put('/accounts/:id', account.updateAccount) // id as param, body.accountName, body.ownerUserID, body.balance
app.delete('/accounts/:id', account.deleteAccount) // id's as params

app.post('/users', user.createUser) // body.userName, body.password
app.get('/users', user.readUser)
app.get('/users/id/:id', user.readUserByID) // id as param
app.get('/users/username/:username', user.readUserByUserName) // userName as param, body.pssword
app.put('/users/:id', user.updateUser) // id as param, body.userName?, body.active?, body.pssword?
app.delete('/users/:id', user.deleteUser) // id as param

// app.get('/getToken', jwtController.genToken)

app.all('*', (req, res) => {
  res.sendStatus(404)
})

if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log('server running on port %d', process.env.PORT)
  })
}
