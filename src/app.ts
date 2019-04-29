import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { createAccount, readAccounts, updateAccount, deleteAccount } from './controllers/accountController'
import { createTransaction, readTransactions } from './controllers/transactionController'
import { readUser, createUser, createAdmin, updateUser, deleteUser } from './controllers/userController'
import { token } from './controllers/tokenController'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.post('/transactions', createTransaction) // body.debitAccount, body.creditAccount, body.amount
app.get('/transactions/', readTransactions) // no required input

app.post('/accounts', createAccount) // body.balance , body.name, body.owner
app.get('/accounts', readAccounts) // no required input
app.put('/accounts/:id', updateAccount) // id as param, body.name, body.owner, body.balance
app.delete('/accounts/:id', deleteAccount) // id's as params

app.post('/users', createUser) // body.userName, body.password
app.get('/users', readUser) // no required input
app.put('/users/:id', updateUser) // id as param, body.userName?, body.deletedAt?, body.pssword?, body.role?
app.delete('/users/:id', deleteUser) // id as param

app.post('/admin', createAdmin) // body.userName, body.password
app.post('/token', token) // body.userName, body.password

app.all('*', (req, res) => {
  res.sendStatus(404)
})

// istanbul ignore if
if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log('server running on port %d', process.env.PORT)
  })
}
