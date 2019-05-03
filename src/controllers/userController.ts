import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
import { createLogger, format, transports } from 'winston'
import { addAdmin, addUser, modifyUser, removeUser, retrieveUser, retrieveUserById, retrieveUserByUserName } from '../models'

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

// get /user #returns all users
export async function readUsers (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  try {
    const result = await retrieveUser()
    if (result.length > 0) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}

// get /users/id/:id #returns single user by id
export async function readUserById (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
  const id: number = req.params.id
  try {
    const result = await retrieveUserById(id)
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
}

// delete /user/:id
export async function deleteUser (req: Request, res: Response) {
  logger.info({ body: req.body, params: req.params, path: req.path, method: req.method })
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
}
