import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as account from './controllers/account'
import * as exchange from './controllers/exchangeController'
import * as jwtController from './controllers/jwtcontroller'
import * as transaction from './controllers/transaction'
import * as user from './controllers/user'
import * as users from './controllers/users'
import * as wallet from './controllers/wallet'
import * as dbFunctions from './db'
import * as middleware from './middleware'
import * as jwt from 'jsonwebtoken'

const app = express()
app.set('port', 3000)
app.use(bodyParser.json())

dbFunctions.initialise()

// temporary user endpoints
import * as tempuser from './password'
// temporary user login
app.get('/login/:userName/:password', tempuser.login)
// creates a user and hashes user password
app.post('/users', tempuser.addUser)
//

app.get('/transactions', transaction.transactions)
app.get('/transaction/:id/', transaction.getTransaction)
app.post('/transaction', middleware.verifyToken, transaction.addTransaction)
app.delete('/transaction/:id', middleware.verifyToken, transaction.delTransaction)
app.put('/transaction/:id', middleware.verifyToken, transaction.updateTransaction)

app.get('/accounts', account.accounts)
app.get('/account/:id', account.getAccount)
app.post('/account', middleware.verifyToken, account.addAccount)
app.delete('/account/:id', middleware.verifyToken, account.delAccount)
app.put('/account/:id', middleware.verifyToken, account.updateAccount)

app.get('/users', user.users)
app.get('/user/:id', user.getuser)
app.post('/user', middleware.verifyToken, user.adduser)
app.delete('/user/:id', middleware.verifyToken, user.deluser)
app.put('/user/:id', middleware.verifyToken, user.updateuser)
app.get('/users/id/:userID', users.getUserByUserId)

app.get('/getToken', jwtController.genToken)

app.get('/exchange', exchange.getRates)

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log('server running on port %d', app.get('port'))
  })
}
module.exports = app
// test for tokens
app.post('/test/posts', middleware.verifyToken,(req, res) => {
  res.json({
    message: 'Post created...'
  })
})

// a prototype login function to be replaced
app.post('/login', (req, res) => {
    // mock user
  const user = {
    id: 1,
    username: 'john',
    email: 'john@foo.com'
  }
  jwt.sign({ user }, 'secret',{ expiresIn: '1d' }, (_err, token) => {
    console.log(`Token generated for ${user.username}`)
    res.json({ token })
  })
})
