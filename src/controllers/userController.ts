import { Request, Response } from 'express'
import { retrieveUser, retrieveUserById, retrieveUserByUserName, addUser, addAdmin, modifyUser, removeUser, User } from '../models/userModel'
import { createLogger, transports, format } from 'winston'
import { isAuthorized } from '../services/authorizeService'
import * as dotenv from 'dotenv'

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

export async function readUser (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, query: req.query, path: req.path, method: req.method })
  const queryBy = Object.keys(req.query)[0]
  try {
    switch (queryBy) {
      case (undefined):
        const result = await retrieveUser()
        res.send(result)
        break
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

export async function readUserById (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, query: req.query, path: req.path, method: req.method })
  if (isAuthorized(req.authData, req.params.id)) {
    try {
      const userById = await retrieveUserById(req.params.id)
      if (userById) {
        res.send(userById)
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
  // check if userName already exists
  const userName: string = req.body.userName
  const pssword: string = req.body.pssword
  try {
    const userExists = await retrieveUserByUserName(userName)
    if (!userExists) {
      const result = await addUser(req.body)
      if (!result) {
        res.sendStatus(200)
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
  // check if userName already exists
  const userName: string = req.body.userName
  const pssword: string = req.body.pssword
  try {
    const userExists = await retrieveUserByUserName(userName)
    if (!userExists) {
      const result = await addAdmin(req.body)
      if (!result) {
        res.sendStatus(200)
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
    try {
      const userExists = await retrieveUserById(req.params.id)
      if (userExists) {
        const result = await modifyUser(userExists, req.body)
        if (!result) {
          res.sendStatus(200)
        } else {
          res.sendStatus(400)
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
        if (!result) {
          res.sendStatus(200)
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
