import { Request, Response } from 'express'
import * as dbFunctions from '../db'
import * as Joi from 'joi'
import * as jwt from 'jsonwebtoken'

// get /user #returns all users
export let users = (req: Request, res: Response) => {
  dbFunctions.query('SELECT * FROM users', (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.json(result)
      }
    }
  })
}

// get /user/{1} #returns user with id 1
export let getuser = (req: Request, res: Response) => {
  dbFunctions.query(`SELECT * FROM users WHERE user_id = '${req.params.id}'`, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.json(result)
      }
    }
  })
}

// post /user #adds new user to table
export let adduser = (req: Request, res: Response) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {
      let keys: string = ''
      let vals: string = ''
      for (let k in req.body) {
        keys += `${k},`
        vals += `'${req.body[k]}',`
      }
      if (keys.length > 0) keys = keys.slice(0, -1)
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

// delete /user/{1} #removes user with id 1
export let deluser = (req: Request, res: Response) => {
    // console.log(req.token);
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {
      dbFunctions.query(`SELECT * FROM users WHERE user_id = '${req.params.id}'`, (err, result) => {
        if (err) {
          res.status(500).send(err)
        } else {
          if (result.length === 0) {
            res.sendStatus(404)
          } else {
            dbFunctions.query(`DELETE FROM users where user_id = '${req.params.id}'`, (err, result) => {
              if (err) {
                res.status(500).send(err)
              } else {
                res.send(`user id: ${req.params.id} deleted`)
              }
            })
          }
        }
      })
    }
  })
}

// put /user/{1} #updates user with id 1
export let updateuser = (req: Request, res: Response) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {
      let str: string = ''
      for (let k in req.body) {
        str += `${k}='${req.body[k]}',`
      }
      if (str.length > 0) str = str.slice(0, -1)
      dbFunctions.query(`UPDATE users SET ${str} WHERE user_id = '${req.params.id}'`, (err) => {
        if (err) {
          res.status(500).send(err)
        } else {
          dbFunctions.query(`SELECT * FROM users WHERE user_id = '${req.params.id}'`, (err, result) => {
            if (err) {
              res.status(500).send(err)
            } else {
              if (result.length === 0) {
                res.status(404).send('invalid id requested')
              } else {
                res.json(result)
              }
            }
          })
        }
      })
    }
  })
}
