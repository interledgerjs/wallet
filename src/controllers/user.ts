import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as dlInterface from '../datalayer/dlInterface'
import * as bcrypt from 'bcrypt'
import * as model from '../models/user'

const saltRounds = 3

export let users = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'users',
    selectAll: true
  }
  dlInterface.handleOp(dataParams, (err, result) => {
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

export let getuser = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'users',
    selectAll: true,
    filter: [{ field: 'userID', operator: '=', value: req.params.id }]
  }
  dlInterface.handleOp(dataParams, (err, result) => {
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

export let getUserByUserName = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'users',
    selectAll: true,
    filter: [{ field: 'userName', operator: '=', value: req.params.userName }]
  }
  dlInterface.handleOp(dataParams, (err, result) => {
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

export let addUser = (req: Request, res: Response) => {
  // check if userName already exists
  let dataParams = {
    action: 'get',
    table: 'users',
    selectAll: true,
    filter: [{ field: 'userName', operator: '=', value: req.body.userName }]
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        const pass = req.body.password
        bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
          if (err) {
            throw err
          } else {
            bcrypt.hash(pass, salt, function (err: any, hash: any) {
              if (err) {
                throw err
              } else {
                req.body.password = hash
                let dataParams = {
                  action: 'post',
                  table: 'users',
                  parameters: req.body
                }
                dlInterface.handleOp(dataParams, (err, result) => {
                  if (err) {
                    res.status(500).send(err)
                  } else {
                    res.send('User added')
                  }
                })

              }
            })
          }
        })
      } else {
        res.json('userName alredy exists')
      }
    }
  })
}

export let deluser = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'users',
    selectAll: true,
    filter: [{ field: 'userID', operator: '=', value: req.params.id }]
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        let delParams = {
          action: 'delete',
          table: 'users',
          filter: [{ field: 'userID', operator: '=', value: req.params.id }]
        }
        dlInterface.handleOp(delParams, (err, result) => {
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

export let updateuser = (req: Request, res: Response) => {
  let dataParams = {
    action: 'put',
    table: 'users',
    filter: [{ field: 'userID', operator: '=', value: req.params.id }],
    parameters: req.body
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      let getParams = {
        action: 'get',
        table: 'users',
        filter: [{ field: 'userID', operator: '=', value: req.params.id }],
        selectAll: true
      }
      dlInterface.handleOp(getParams, (err, result) => {
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

export let login = (req: Request, res: Response) => {
  let password = req.body.password
  let dataParams = {
    action: 'get',
    table: 'users',
    selectAll: true,
    filter: [{ field: 'userName', operator: '=', value: req.params.userName }]
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      bcrypt.compare(password, result[0].password, function (err: any, answer: any) {
        if (err) {
          throw err
        }
        if (answer) {
          const user = {
            userID: result[0].userID,
            userName: result[0].userName
          }
          jwt.sign({ user }, process.env.SECRETKEY,{ expiresIn: '1d' }, (_err, token) => {
            res.json({ token })
          })
        } else {
          res.json('Invalid password.')
        }
      })
    }
  })
}

// new controllers

// get /user #returns all users
export function readUser (req: Request, res: Response) {
  model.readUser(function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve users')
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
}

// get /user/id/:id #returns single user by id
export function readUserByID (req: Request, res: Response) {
  const userID: number = req.params.id
  model.readUserByID(userID, function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve user')
    } else {
      if (!result) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
}

// get /user/id/:id #returns single user by userName
export function readUserByUserName (req: Request, res: Response) {
  const userName: string = req.params.username
  model.readUserByUsername(userName, function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve user')
    } else {
      if (!result) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
}
