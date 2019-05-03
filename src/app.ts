import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { createAccount, readAccounts, updateAccount, deleteAccount } from './controllers/accountController'
import { createTransaction, readTransactions } from './controllers/transactionController'
import { readUsers, readUserById, createUser, createAdmin, updateUser, deleteUser } from './controllers/userController'
import { token } from './controllers/tokenController'
import { verifyToken, Roles } from './services/jwtService'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.post('/transactions', createTransaction) // body.debitAccountId, body.creditAccountId, body.amount
app.get('/transactions/', readTransactions) // no required input

app.post('/accounts', createAccount) // body.balance , body.name, body.owner
app.get('/accounts', readAccounts) // no required input
app.put('/accounts/:id', updateAccount) // id as param, body.name, body.owner, body.balance
app.delete('/accounts/:id', deleteAccount) // id's as params

app.post('/users', createUser) // body.userName, body.password
app.get('/users', verifyToken(Roles.Admin), readUsers) // no required input
app.get('/users/:id', verifyToken(Roles.User), readUserById)
app.put('/users/:id', verifyToken(Roles.User), updateUser) // id as param, body.userName?, body.deletedAt?, body.pssword?, body.role?
app.delete('/users/:id', verifyToken(Roles.User), deleteUser) // id as param

app.post('/admin', verifyToken(Roles.Admin), createAdmin) // body.userName, body.password
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
