import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { Roles, verifyToken } from '../services'

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
