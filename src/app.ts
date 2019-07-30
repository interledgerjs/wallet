import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { createAccount, createAdmin, createTransaction, createUser, deleteAccount, deleteUser, readAccounts, readAccountById, readTransactionById, readTransactions, readUserById, readUsers, token, updateAccount, updateUser } from './controllers'
import { verifyToken, Roles } from './services'
import { postUserInputValidator, putUserInputValidator, postAccountInputValidator, postTransactionInputValidator, putAccountInputValidator } from './services/validation'
import * as cors from 'cors'
import { retrieveUserById } from './models';

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())
app.use(cors({
  exposedHeaders: 'Link'
}))

app.post('/transactions', postTransactionInputValidator, verifyToken(Roles.User), createTransaction) // body.debitAccountId, body.creditAccountId, body.amount
app.get('/transactions/', verifyToken(Roles.User), readTransactions) // no required input
app.get('/transactions/:id', verifyToken(Roles.User), readTransactionById)

app.post('/accounts', postAccountInputValidator, verifyToken(Roles.User), createAccount) // body.name, body.owner
app.get('/accounts', verifyToken(Roles.User), readAccounts) // no required input
app.get('/accounts/:id', verifyToken(Roles.User), readAccountById)
app.put('/accounts/:id', putAccountInputValidator, verifyToken(Roles.User), updateAccount) // id as param, body.name, body.owner
app.delete('/accounts/:id', verifyToken(Roles.Admin), deleteAccount) // id's as params

app.post('/users', postUserInputValidator, createUser) // body.userName, body.password
app.get('/users', verifyToken(Roles.Admin), readUsers) // no required input
app.get('/users/:id', verifyToken(Roles.User), readUserById)
app.put('/users/:id', verifyToken(Roles.User), putUserInputValidator, updateUser) // id as param, body.userName?, body.deletedAt?, body.pssword?, body.role?
app.delete('/users/:id', verifyToken(Roles.User), deleteUser) // id as param

app.post('/admin', verifyToken(Roles.Admin), postUserInputValidator, createAdmin) // body.userName, body.password
app.post('/token', postUserInputValidator, token) // body.userName, body.password

// payment pointers for users
app.get('/:id', async (req, res) => {
  const authUrl = process.env.HYDRA_AUTH_URL || 'http://localhost:9000/oauth2/auth'
  res.set('Link', `<${authUrl}>; rel="authorization_endpoint"`)
  res.sendStatus(200)
})

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
