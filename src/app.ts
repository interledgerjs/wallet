import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as account from './controllers/account'
import * as exchange from './controllers/exchangeController'
import * as jwtController from './controllers/jwtcontroller'
import * as transaction from './controllers/transaction'
import * as user from './controllers/user'
import * as users from './controllers/users'
import * as dbFunctions from './db'
import * as middleware from './middleware'
import * as jwt from 'jsonwebtoken'

const app = express()
app.set('port', 3000)
app.use(bodyParser.json())

dbFunctions.initialise()

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

<<<<<<< HEAD
app.get('/users', user.users)
app.get('/user/:id', user.getuser)
app.post('/user', middleware.verifyToken, user.adduser)
app.delete('/user/:id', middleware.verifyToken, user.deluser)
app.put('/user/:id', middleware.verifyToken, user.updateuser)
app.get('/users/id/:user_id', users.getUserByUserId)

app.get('/getToken', jwtController.genToken)
=======
app.get("/users", user.users);
app.get("/user/:id", user.getuser);
app.post("/user", middleware.verifyToken, user.adduser);
app.delete("/user/:id", middleware.verifyToken, user.deluser);
app.put("/user/:id", middleware.verifyToken, user.updateuser);

app.get("/getToken", jwtController.genToken);
>>>>>>> d2e9b442ee2ad70954e444f6aab2e0205b7b08f7

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
