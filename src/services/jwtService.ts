import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/userModel'
import { token } from '../controllers/tokenController'

// roles to be used for authorisation
export enum Roles {
  Admin = 'admin',
  User = 'user'
}

// #returns req.authdata object
export function verifyToken (roles: Roles) {
  return function (req: Request, res: Response, next: any) {
    const bearerHeader: string = req.headers['authorization']
    if (bearerHeader) {
            // pulls token out of header
      const bearer: string[] = bearerHeader.split(' ')
      const bearerToken: string = bearer[1]
      req['token'] = bearerToken

            // verifies token and returns authData
      jwt.verify(req.token, process.env.SECRETKEY, { algorithms: ['HS256'] }, (err: Error, tokenData: any) => {
        if (err) {
          res.sendStatus(403)
        } else if (tokenData.authData.userRole !== roles && tokenData.authData.userRole !== Roles.Admin) {
          res.sendStatus(401)
        } else {
          req.authData = tokenData.authData
          next()
        }
      })
    } else {
      res.sendStatus(403)
    }
  }
}
