import { Request, Response } from 'express'
// import * as jwt from 'jsonwebtoken'
import { retrieveUser, retrieveUserByID, retrieveUserByUserName, addUser, modifyUser, removeUser, User } from '../models/userModel'
import * as bcrypt from 'bcrypt'
const saltRounds = 3

// get /user #returns all users
export async function readUser (req: Request, res: Response) {
  try {
    const result = await retrieveUser()
    if (result.length > 0) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// get /users/id/:id #returns single user by id
export async function readUserByID (req: Request, res: Response) {
  const userID: number = req.params.id
  try {
    const result = await retrieveUserByID(userID)
    if (result) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// get /users/username/:username #returns single user by userName
export async function readUserByUserName (req: Request, res: Response) {
  const userName: string = req.params.username

  try {
    const result = await retrieveUserByUserName(userName)
    if (result) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// post /users #adds new user to table
export async function createUser (req: Request, res: Response) {
  // check if userName already exists
  const userName: string = req.body.userName

  try {
    const userExists = await retrieveUserByUserName(userName)
    if (!userExists) {
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(req.body.pssword, salt)
      const userObject: User = {
        userID: -1,
        userName: req.body.userName,
        dateCreated: new Date().toISOString(),
        deletedAt: '',
        userRole: req.body.userRole,
        pssword: hash
      }
      const result = await addUser(userObject)
      if (!result) {
        res.send('User created')
      } else {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// put /user/:id
export async function updateUser (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10)) &&
    (req.body.userName === undefined || typeof req.body.userName === 'string') &&
    (req.body.dateCreated === undefined || typeof req.body.dateCreated === 'string') &&
    (req.body.deletedAt === undefined || typeof req.body.deletedAt === 'boolean') &&
    (req.body.userRole === undefined || typeof req.body.userRole === 'string') &&
    (req.body.pssword === undefined || typeof req.body.pssword === 'string')

  ) {
    try {
      const userExists = await retrieveUserByID(req.params.id)
      if (userExists) {
        const userObject: User = {
          userID: userExists.userID,
          userName: userExists.userName,
          dateCreated: userExists.dateCreated,
          deletedAt: userExists.deletedAt,
          userRole: userExists.userRole,
          pssword: userExists.pssword
        }
        if (req.body.userName !== undefined) {
          userObject.userName = req.body.userName
        }
        if (req.body.dateCreated !== undefined) {
          userObject.dateCreated = req.body.dateCreated
        }
        if (req.body.deletedAt !== undefined) {
          userObject.deletedAt = req.body.deletedAt
        }
        if (req.body.userRole !== undefined) {
          userObject.userRole = req.body.userRole
        }
        if (req.body.pssword !== undefined) {
          const salt = await bcrypt.genSalt(saltRounds)
          const hash = await bcrypt.hash(req.body.pssword, salt)
          userObject.pssword = hash
        }
        const result = await modifyUser(userObject)
        if (!result) {
          res.send('Successfully updated user')
        }
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      res.sendStatus(500)
    }
  } else {
    res.status(400).send('Bad request')
  }
}

// delete /user/:id
export async function deleteUser (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    try {
      const userExists = await retrieveUserByID(req.params.id)
      if (userExists) {
        const result = await removeUser(req.params.id)
        if (!result) {
          res.send('Successfully deleted user')
        }
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      res.sendStatus(500)
    }
  } else {
    res.status(400).send('Bad request')
  }
}
