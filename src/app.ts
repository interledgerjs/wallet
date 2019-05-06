import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { createAccount, createAdmin, createTransaction, createUser, deleteAccount, deleteUser, readAccounts, readAccountById, readTransactions, readUserById, readUsers, token, updateAccount, updateUser } from './controllers'
import { verifyToken, Roles } from './services'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.post('/transactions', createTransaction) // body.debitAccountId, body.creditAccountId, body.amount
app.get('/transactions/', readTransactions) // no required input

app.post('/accounts', verifyToken(Roles.User), createAccount) // body.name, body.owner
app.get('/accounts', verifyToken(Roles.User), readAccounts) // no required input
app.get('/accouunts/:id', verifyToken(Roles.User), readAccountById)
app.put('/accounts/:id', verifyToken(Roles.Admin), updateAccount) // id as param, body.name, body.owner
app.delete('/accounts/:id', verifyToken(Roles.Admin), deleteAccount) // id's as params

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
