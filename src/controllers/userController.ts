import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
import { createLogger, format, transports } from 'winston'
import { addAdmin, addUser, modifyUser, modifyUserAdmin, removeUser, retrieveUsers, retrieveUserById, retrieveUserByUserName } from '../models'
import { isAuthorized } from '../services'
import { validate } from '../services/validation'

dotenv.config()
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports : []
})
if (process.env.CONSOLELOG === 'true') {
  logger.add(new transports.Console())
}
if (process.env.LOGFILE === 'true') {
  logger.add(new transports.File({ filename: 'logs.log' }))
}

/// get /user #returns all users
export async function readUsers (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  try {
    const result = await retrieveUsers()
    if (result) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

export async function readUserById (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, query: req.query, path: req.path, method: req.method })
  if (isAuthorized(req.authData, parseInt(req.params.id, 10))) {
    try {
      const userById = await retrieveUserById(req.params.id)
      if (userById) {
        const returnObject = {
          id: userById.id,
          userName: userById.userName,
          dateCreated: userById.dateCreated
        }
        res.send(returnObject)
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(401)
  }
}

// post /users #adds new user to table
export async function createUser (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (!validate(req, res)) {
    return
  }
  try {
    // check if userName already exists
    const userExists = await retrieveUserByUserName(req.body.userName)
    // console.log(userExists)
    if (!userExists) {
      const result = await addUser(req.body)
      if (result) {
        const returnObject = {
          id: result.id,
          userName: result.userName,
          dateCreated: result.dateCreated
        }
        res.send(returnObject)
      } else {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

// post /users #adds new admin to table
export async function createAdmin (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (!validate(req,res)) {
    return
  }
  try {
    // check if userName already exists
    const userExists = await retrieveUserByUserName(req.body.userName)
    if (!userExists) {
      const result = await addAdmin(req.body)
      if (result) {
        const returnObject = {
          id: result.id,
          userName: result.userName,
          role: result.role,
          dateCreated: result.dateCreated,
          deletedAt: result.deletedAt
        }
        res.send(returnObject)
      } else {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

// put /user/:id
export async function updateUser (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (isAuthorized(req.authData, parseInt(req.params.id, 10))) {
    if (!validate(req,res)) {
      return
    }
    try {
      const userExists = await retrieveUserById(req.params.id)
      if (userExists) {
         // admin access
        if (req.authData.role === 'admin') {
          const result = await modifyUserAdmin(userExists, req.body)
          if (result) {
            const returnObject = {
              id: result.id,
              userName: result.userName,
              role: result.role,
              dateCreated: result.dateCreated,
              deletedAt: result.deletedAt
            }
            res.send(result)
          } else {
            res.sendStatus(400)
          }
       // user access
        } else if (parseInt(req.params.id, 10) === req.authData.id) {
          const result = await modifyUser(userExists, req.body)
          if (result) {
            const returnObject = {
              id: result.id,
              userName: result.userName,
              dateCreated: result.dateCreated
            }
            res.send(returnObject)
          } else {
            res.sendStatus(400)
          }
        }
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(401)
  }
}

// delete /user/:id
export async function deleteUser (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  if (isAuthorized(req.authData, parseInt(req.params.id, 10))) {
    try {
      const userExists = await retrieveUserById(req.params.id)
      if (userExists) {
        const result = await removeUser(req.params.id)
        if (result) {
          const returnObject = {
            id: result.id,
            userName: result.userName,
            role: result.role,
            dateCreated: result.dateCreated,
            deletedAt: result.deletedAt
          }
          res.send(returnObject)
        }
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(401)
  }
}
