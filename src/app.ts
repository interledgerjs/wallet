import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as account from './controllers/accountController'
import * as transaction from './controllers/transactionController'
import { readUser, readUserByID, readUserByname, createUser, createAdmin, updateUser, deleteUser } from './controllers/userController'
import { token } from './controllers/tokenController'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.post('/transactions', transaction.createTransaction) // body.id?, body.debitAccount, body.creditAccount, body.amount
app.get('/transactions/', transaction.readTransactions) // no required input
app.get('/transactions/id/:id/', transaction.readTransactionByID) // id as param
app.get('/transactions/account/:id/', transaction.readTransactionByAccount) // account id as param

app.post('/accounts', account.createAccount) // body.balance , body.name, body.owner
app.get('/accounts/id/:id', account.readAccountByID) // id's as param
app.get('/accounts/id/:id/', account.readAllAccountsByid)
app.get('/accounts', account.readAllAccounts) // no required input
app.put('/accounts/:id', account.updateAccount) // id as param, body.name, body.owner, body.balance
app.delete('/accounts/:id', account.deleteAccount) // id's as params

app.post('/users', createUser) // body.name, body.password
app.get('/users', readUser)
app.get('/users/id/:id', readUserByID) // id as param
app.get('/users/name/:name', readUserByname) // name as param, body.pssword
app.put('/users/:id', updateUser) // id as param, body.name?, body.deletedAt?, body.pssword?, body.role?
app.delete('/users/:id', deleteUser) // id as param

app.post('/admin', createAdmin) // body.name, body.password
app.post('/token', token) // body.name, body.password

app.all('*', (req, res) => {
  res.sendStatus(404)
})

if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log('server running on port %d', process.env.PORT)
  })
}
