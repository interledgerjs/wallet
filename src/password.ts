// prototype for user login with hashed passwords

import { Request, Response } from 'express'
import * as dbFunctions from './db'

const bcrypt = require('bcrypt')
const saltRounds = 3

// #adds new user to table and hashes user password
export let addUser = (req: Request, res: Response) => {
  let keys: string = ''
  for (let k in req.body) {
    keys += `${k},`
  }
  if (keys.length > 0) keys = keys.slice(0, -1)

  const userName = req.body.userName
  const active = req.body.active
  const password = req.body.password

  bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
    if (err) {
      throw err
    } else {
      bcrypt.hash(password, salt, function (err: any, hash: any) {
        if (err) {
          throw err
        } else {

          let vals: string = ''
          vals += `'${userName}','${active}','${hash}',`
          if (vals.length > 0) vals = vals.slice(0, -1)

          dbFunctions.query(`INSERT INTO users (${keys}) VALUES (${vals})`, (err) => {
            if (err) {
              res.status(500).send(err)
            } else {
              res.send(req.body)
            }
          })
        }
      })
    }
  })
}

// login
export let login = (req: Request, res: Response) => {
  let password = req.params.password
  dbFunctions.query(`SELECT * FROM users WHERE userName = '${req.params.userName}'`, (err, array) => {
    if (err) {
      throw err
    }
    bcrypt.compare(password, array[0].password, function (err: any, result: any) {
      if (err) {
        throw err
      }
      if (result) {
        res.json('success')
      } else {
        res.json('fail')
      }
    })
  })
}
