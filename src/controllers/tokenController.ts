import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { createLogger, format, transports } from 'winston'
import { retrieveUserByUserName } from '../models'
import { compareHash } from '../services'

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

// get /token #returns a token
export async function token (req: Request, res: Response) {
  const userName: string = req.body.userName
  const pssword: string = req.body.pssword
  try {
    const userExists = await retrieveUserByUserName(userName)
    if (userExists) {
      const result = await compareHash(userExists, pssword)
      if (result) {
        const authData = {
          id: userExists.id,
          userName: userExists.userName,
          role: userExists.role
        }
        logger.info(authData)
        jwt.sign({ authData }, 'secret',{ expiresIn: '1d' }, (_err, token) => {
          res.json({ token })
        })
      } else {
        res.sendStatus(401)
      }
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
}
