import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { createAccount, readAccountById, readAccounts, readAccountByOwner, updateAccount, deleteAccount } from './controllers/accountController'
import { createTransaction, readTransactions, readTransactionById, readTransactionByAccount } from './controllers/transactionController'
import { readUser, readUserById, readUserByUserName, createUser, createAdmin, updateUser, deleteUser } from './controllers/userController'
import { token } from './controllers/tokenController'
import { verifyToken, Roles } from './services/jwtService'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.post('/transactions', createTransaction) // body.id?, body.debitAccount, body.creditAccount, body.amount
app.get('/transactions/', readTransactions) // no required input
app.get('/transactions/id/:id/', readTransactionById) // id as param
app.get('/transactions/account/:id/', readTransactionByAccount) // account id as param

app.post('/accounts', createAccount) // body.balance , body.name, body.owner
app.get('/accounts/id/:id', readAccountById) // id's as param
app.get('/accounts/id/:id/', readAccountByOwner)
app.get('/accounts', readAccounts) // no required input
app.put('/accounts/:id', updateAccount) // id as param, body.name, body.owner, body.balance
app.delete('/accounts/:id', deleteAccount) // id's as params

app.post('/users', createUser) // body.userName, body.password
app.get('/users', readUser)
app.get('/users/:id', readUserById) // id as param
app.get('/users/username/:username', readUserByUserName) // userName as param, body.pssword
app.put('/users/:id', updateUser) // id as param, body.userName?, body.deletedAt?, body.pssword?, body.role?
app.delete('/users/:id', deleteUser) // id as param

app.post('/admin', createAdmin) // body.userName, body.password
app.post('/token', token) // body.userName, body.password

// current dummy endpoints for testing WIP
app.get('/testAdmin', verifyToken(Roles.Admin), function (req, res, next) {
  res.sendStatus(200)
  return 'test'
})

app.get('/testUser', verifyToken(Roles.User), function (req, res, next) {
  res.sendStatus(200)
  return 'test'
})

app.all('*', (req, res) => {
  res.sendStatus(404)
})

if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log('server running on port %d', process.env.PORT)
  })
}
