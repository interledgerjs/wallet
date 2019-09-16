import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { createAccount, createAdmin, createTransaction, createUser, deleteAccount, deleteUser, readAccounts, readAccountById, readTransactionById, readTransactions, readUserById, readUsers, token, updateAccount, updateUser } from './controllers'
import { verifyToken, Roles } from './services'
import { postUserInputValidator, putUserInputValidator, postAccountInputValidator, postTransactionInputValidator, putAccountInputValidator } from './services/validation'
import { get as getOauthLogin, post as postOauthLogin } from './controllers/oauthLoginController'
import { get as getOauthConsent, post as postOauthConsent } from './controllers/oauthConsentController'
import * as cors from 'cors'

export type OAuthServerMetaData = {
  // Ilp extension to meta data
  payment_intents_endpoint: string
  payment_mandates_endpoint: string
  payment_assets_supported: { code: string, scale: number }[]
  // Subset of current meta data specified in RFC8414
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  response_types_supported: string[]
  jwks_uri?: string
  registration_endpoint?: string
  scopes_supported?: string[]
  response_modes_supported?: string[]
  grant_types_supported?: string[]
  token_endpoint_auth_methods_supported?: string[]
  service_documentation?: string
  token_endpoint_auth_signing_alg_values_supported?:  string[]
  ui_locales_supported?: string
  op_policy_uri?: string
  op_tos_uri?: string
}

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

// Oauth Login and Consent
app.get('/oauth/login', getOauthLogin)
app.post('/oauth/login', postOauthLogin)
app.get('/oauth/consent', getOauthConsent)
app.post('/oauth/consent', postOauthConsent)

// payment pointers for users
app.get('/:id', async (req, res) => {
  res.set('content-type', 'application/json')
  const serverMetaData: OAuthServerMetaData = {
    issuer: process.env.HOST,
    authorization_endpoint: process.env.AUTHORIZATION_ENDPOINT || 'http://localhost:9000/oauth2/auth',
    token_endpoint: process.env.TOKEN_ENDPOINT || 'http://localhost:9000/oauth2/token',
    registration_endpoint: process.env.REGISTRATION_ENDPOINT || 'http://localhost:9001/clients',
    response_types_supported:  ['openid', 'offline_access'],
    payment_assets_supported: [{"code": "USD", "scale": 2}],
    payment_intents_endpoint: process.env.PAYMENT_INTENTS_ENDPOINT || 'http://localhost:3001/agreements',
    payment_mandates_endpoint: process.env.PAYMENT_MANDATES_ENDPOINT || 'http://localhost:3001/agreements'
  }

  res.status(200).send(serverMetaData)
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
