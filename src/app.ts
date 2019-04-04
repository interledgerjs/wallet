import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as account from './controllers/accountController'
import * as transaction from './controllers/transactionController'
import { readUser, readUserByID, readUserByUserName, createUser, createAdmin, updateUser, deleteUser } from './controllers/userController'
import { token } from './controllers/tokenController'

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

app.post('/users', createUser) // body.userName, body.password
app.get('/users', readUser)
app.get('/users/id/:id', readUserByID) // id as param
app.get('/users/username/:username', readUserByUserName) // userName as param, body.pssword
app.put('/users/:id', updateUser) // id as param, body.userName?, body.deletedAt?, body.pssword?, body.userRole?
app.delete('/users/:id', deleteUser) // id as param

app.post('/admin', createAdmin) // body.userName, body.password
app.post('/token', token) // body.userName, body.password

app.all('*', (req, res) => {
  res.sendStatus(404)
})

if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log('server running on port %d', process.env.PORT)
  })
}
