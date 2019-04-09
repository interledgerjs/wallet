import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/userModel'
import { token } from '../controllers/tokenController';

// verifyToken
export function verifyToken (req: Request, res: Response, next: any) {
  const bearerHeader: string = req.headers['authorization']
  if (bearerHeader) {
        // pulls token out of header
    const bearer: string[] = bearerHeader.split(' ')
    const bearerToken: string = bearer[1]
    req['token'] = bearerToken

        // verifies token and returns tokenData
    jwt.verify(req.token, process.env.SECRETKEY, { algorithms: ['HS256'] }, (err: Error, tokenData: any) => {
      if (err) {
        res.sendStatus(403)
      } else {
        req.authData = tokenData
        next()
      }
    })
  } else {
    res.sendStatus(403)
  }
}

export function verifyRoleToken (roles: string) {
  return function (req: Request, res: Response, next: any) {
    const bearerHeader: string = req.headers['authorization']
    if (bearerHeader) {
            // pulls token out of header
      const bearer: string[] = bearerHeader.split(' ')
      const bearerToken: string = bearer[1]
      req['token'] = bearerToken

            // verifies token and returns authData
      jwt.verify(req.token, process.env.SECRETKEY, { algorithms: ['HS256'] }, (err: Error, tokenData: any) => {
        if (err || tokenData.authData.userRole !== roles) {
          res.sendStatus(403)
        } else {
          req.authData = tokenData
          next()
        }
      })
    } else {
      res.sendStatus(403)
    }
  }
}
