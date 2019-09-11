import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { createLogger, format, transports } from 'winston'

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

// to add token middleware add verifyToken(Roles.User/Admin) to an endpoint
// roles to be used for authorisation
export enum Roles {
  Admin = 'admin',
  User = 'user'
}

/** @returns req.app.locals.authData object */
export function verifyToken (roles: Roles) {

  return function (req: Request, res: Response, next: any) {
    logger.info({ body: req.body, headers: req.headers['authorization'] })

    const bearerHeader: string = req.headers['authorization']
    if (bearerHeader) {
            // pulls token out of header
      const bearer: string[] = bearerHeader.split(' ')
      const bearerToken: string = bearer[1]

      // verifies token and returns authData
      jwt.verify(bearerToken, process.env.SECRETKEY, { algorithms: ['HS256'] }, (err: Error, tokenData: any) => {
        if (err) {
          res.sendStatus(403)
        } else if (tokenData.authData.role !== roles && tokenData.authData.role !== Roles.Admin) {
          res.sendStatus(401)
        } else {
          req.app.locals.authData = tokenData.authData
          next()
        }
      })
    } else {
      res.sendStatus(403)
    }
  }
}
