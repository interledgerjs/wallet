import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as accounts from './controllers/accounts'
import * as exchange from './controllers/exchangeController'
import * as jwtController from './controllers/jwtcontroller'
import * as transactions from './controllers/transactions'
import * as users from './controllers/users'
import * as wallet from './controllers/wallet'
import * as dbFunctions from './db'
import * as middleware from './middleware'

const app = express()
app.set('port', 3000)
app.use(bodyParser.json())

dbFunctions.initialise()

app.get('/getToken', jwtController.genToken)

// USERS ENDPOINTS ARE UNTESTED
app.get('/users/id/:user_id', users.getUserByUserId)
app.get('/users/name/:user_name', users.getUserByUserName)
app.post('/users/:user_name', users.createNewUser)
app.put('/users/:user_id/status', users.deactivateStatusOfUserId) // is this route name ok? refer to staff

// ACCOUNTS ENDPOINTS ARE UNTESTED
app.get('/accounts/:owner_user_id', accounts.getAccsByOwnerUserId)
app.get('/accounts/:account_id', accounts.getAccByAccountId)
app.post('/accounts', accounts.createNewAcc)
app.put('/accounts', accounts.updateAcc)
    // json fields: account_id, amount

// TRANSACTIONS ENDPOINTS ARE UNTESTED
app.get('/transactions', transactions.transactions)
app.get('/transaction/:id/', transactions.getTransaction)
app.post('/transactions', middleware.verifyToken, transactions.addTransaction)
app.put('/transactions/:id/:execute*?', middleware.verifyToken, transactions.updateTransaction) // this will be refined at a later stage

app.get('/exchange', exchange.getRates)

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log('server running on port %d', app.get('port'))
  })
}
// app.listen(app.get('port'), () => {
//   console.log('server running on port %d', app.get('port'))
// })

module.exports = app
