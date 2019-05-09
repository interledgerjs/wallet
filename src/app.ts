import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { createAccount, createAdmin, createTransaction, createUser, deleteAccount, deleteUser, readAccounts, readTransactions, readUserById, readUsers, token, updateAccount, updateUser } from './controllers'
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

const start = async () => {
  const port = process.env.PORT || 3000
  try {
    app.listen(port, () => {
      console.log('server running on port %d', port)
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
// instabul ignore if
if (!module.parent) {
  start().catch(err => {
    console.log(err)
    process.exit(1)
  })
}
