import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as account from './controllers/accountController'
import * as transaction from './controllers/transactionController'
import { readUser, readUserById, readUserByUserName, createUser, createAdmin, updateUser, deleteUser } from './controllers/userController'
import { token } from './controllers/tokenController'
import { verifyRoleToken, verifyToken } from './services/jwtService'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

// to add token middleware either use verifyToken (for all users), or verifyAdmin for admins only
let verifyAdmin = verifyRoleToken('admin')

app.post('/transactions', transaction.createTransaction) // body.id?, body.debitAccount, body.creditAccount, body.amount
app.get('/transactions/', transaction.readTransactions) // no required input
app.get('/transactions/id/:id/', transaction.readTransactionById) // id as param
app.get('/transactions/account/:id/', transaction.readTransactionByAccount) // account id as param

app.post('/accounts', account.createAccount) // body.balance , body.name, body.owner
app.get('/accounts/id/:id', account.readAccountById) // id's as param
app.get('/accounts/id/:id/', account.readAllAccountsById)
app.get('/accounts', account.readAllAccounts) // no required input
app.put('/accounts/:id', account.updateAccount) // id as param, body.name, body.owner, body.balance
app.delete('/accounts/:id', account.deleteAccount) // id's as params

app.post('/users', createUser) // body.userName, body.password
app.get('/users', readUser)
app.get('/users/id/:id', readUserById) // id as param
app.get('/users/username/:username', readUserByUserName) // userName as param, body.pssword
app.put('/users/:id', updateUser) // id as param, body.userName?, body.deletedAt?, body.pssword?, body.role?
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
