import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { verifyToken, Roles } from '../services/jwtService'
import { createUser } from '../controllers/userController'
import { token } from '../controllers/tokenController'

dotenv.config()
const app = express()
module.exports = app
app.use(bodyParser.json())

app.get('/testAdmin', verifyToken(Roles.Admin), function (req, res, next) {
  res.sendStatus(200)
  return 'test'
})

app.get('/testUser', verifyToken(Roles.User), function (req, res, next) {
  res.sendStatus(200)
  return 'test'
})

app.post('/token', token) // body.userName, body.password

app.post('/users', createUser)
