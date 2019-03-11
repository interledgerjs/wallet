import { Request, Response } from 'express'
// import * as jwt from 'jsonwebtoken'
import * as model from '../models/user'
import * as bcrypt from 'bcrypt'
const saltRounds = 3

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
  model.readUserByUserName(userName, function (error, result) {
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

// post /users #adds new user to table
export function createUser (req: Request, res: Response) {
  // check if userName already exists
  const userName = req.body.userName
  model.readUserByUserName(userName, function (error, result) {
    if (error) {
      // Unable to retrieve user by userName
      res.status(500)
    } else {
      if (!result) {
        bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
          if (err) {
            throw err
          } else {
            bcrypt.hash(req.body.password, salt, function (err: any, hash: any) {
              if (err) {
                throw err
              } else {
                const userObject: model.User = {
                  userID: -1,
                  userName: req.body.userName,
                  dateCreated: new Date().toISOString(),
                  active: true,
                  pssword: hash
                }
                model.createUser(userObject, function (error) {
                  if (error) {
                    // if invalid params
                    res.status(500).send('Unable to create user')
                  } else {
                    res.send('User created')
                  }
                })
              }
            })
          }
        })
      } else {
        // if userName already exists
        res.send('Unable to create user')
      }
    }
  })
}
// put /user/:id
export function updateUser (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10)) &&
    (req.body.userName === undefined || typeof req.body.userName === 'string') &&
    (req.body.dateCreated === undefined || typeof req.body.dateCreated === 'string') &&
    (req.body.active === undefined || typeof req.body.active === 'boolean') &&
    (req.body.pssword === undefined || typeof req.body.pssword === 'string')

  ) {
    model.readUserByID(req.params.id, function (error, result) {
      if (error) {
        res.status(500).send('Unable to update user')
      } else {
        if (result) {
          bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
            if (err) {
              throw err
            } else {
              bcrypt.hash(req.body.password, salt, function (err: any, hash: any) {
                if (err) {
                  throw err
                } else {
                  const userObject: model.User = {
                    userID: result.userID,
                    userName: result.userName,
                    dateCreated: result.dateCreated,
                    active: result.active,
                    pssword: result.pssword
                  }
                  if (req.body.userName !== undefined) {
                    userObject.userName = req.body.userName
                  }
                  if (req.body.dateCreated !== undefined) {
                    userObject.dateCreated = req.body.dateCreated
                  }
                  if (req.body.active !== undefined) {
                    userObject.active = req.body.active
                  }
                  if (req.body.pssword !== undefined) {
                    userObject.pssword = hash
                  }
                  model.updateUser(userObject, function (error) {
                    if (error) {
                      res.status(500).send('Unable to update user')
                    } else {
                      res.send('Successfully updated user')
                    }
                  })
                }
              })
            }
          })
        } else {
          res.status(404).send('User does not exist')
        }
      }
    })
  } else {
    res.status(400).send('Bad request')
  }
}

// delete /user/:id
export function deleteUser (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    model.readUserByID(req.params.id, function (error, result) {
      if (error) {
        res.status(500).send('Unable to update user')
      } else {
        if (result) {
          model.deleteUser(req.params.id, function (error) {
            if (error) {
              res.status(500).send('Unable to delete user')
            } else {
              res.send('Successfully deleted user')
            }
          })
        } else {
          res.status(404).send('User does not exist')
        }
      }
    })
  } else {
    res.status(400).send('Bad request')
  }
}
