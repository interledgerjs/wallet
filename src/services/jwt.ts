import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { User, AdminUser } from '../models/user'

// verifyToken
export function verifyToken (req: Request, res: Response, next: any) {
  const bearerHeader: string = req.headers['authorization']
  if (bearerHeader) {
        // pulls token out of header
    const bearer: string[] = bearerHeader.split(' ')
    const bearerToken: string = bearer[1]
    req['token'] = bearerToken

        // verifies token and returns authData
    jwt.verify(req.token, process.env.SECRETKEY, { algorithms: ['HS256'] }, (err: Error, authData) => {
      if (err) {
        res.sendStatus(403)
      } else {
        req.authData = authData
        next()
      }
    })
  } else {
    res.sendStatus(403)
  }
}

export function verifyRoleToken (roles) {
  // if (typeof roles === 'string') {
  //   roles = [roles]
  // }
  return function (req: Request, res: Response, next: any) {
    const bearerHeader: string = req.headers['authorization']
    if (bearerHeader) {
            // pulls token out of header
      const bearer: string[] = bearerHeader.split(' ')
      const bearerToken: string = bearer[1]
      req['token'] = bearerToken

            // verifies token and returns authData
      jwt.verify(req.token, process.env.SECRETKEY, { algorithms: ['HS256'] }, (err: Error, authData: AdminUser) => {
        if (err || authData.userRole !== roles) {
          console.log('Role not authorised')
          res.sendStatus(403)
        } else {
          console.log('Token Verified')
          console.log(roles)
          req.authData = authData
          // res.json(authData)
          res.sendStatus(200) // remove when this is actually middleware
          next()
        }
      })
    } else {
      res.sendStatus(403)
    }
  }
}

/*
// verifyToken
export function verifyToken (roles) {
  if (typeof roles === 'string') {
    roles = [roles]
  }
  return [
    (req: any, res: Response, next: any) => {
      console.log('Here')
      const bearerHeader: string = req.headers['authorization']
      if (bearerHeader) {
        // pulls token out of header
        const bearer: string[] = bearerHeader.split(' ')
        const bearerToken: string = bearer[1]
        req['token'] = bearerToken

        // verifies token and returns authData
        jwt.verify(req.token , process.env.SECRETKEY, { algorithms: ['HS256'] }, (err: Error, authData) => {
          if (err || (req.authData.role !== roles)) {
            res.sendStatus(403)
          } else {
                // console.log('Token Verified');
            req.authData = authData
            req.params = authData
            next()
          }
        })
      } else {
        res.sendStatus(403)
      }
    }
  ]
}

export function authorize (roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return [
      // authenticate JWT token and attach user to request object (req.user)
    // expressJwt({ secret }),

      // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
              // user's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' })
      }

          // authentication and authorization successful
      next()
    }
  ]
}

import * as model from '../models/user'
import * as bcrypt from 'bcrypt'

// get /token #returns a token
export function token (req: Request, res: Response) {
  const userName: string = req.body.userName
  const pssword: string = req.body.pssword
  model.readUserByUserName(userName, function (error, result) {
    if (error) {
      res.sendStatus(500)
    } else if (!result) {
      res.sendStatus(404)
    } else {
      bcrypt.compare(pssword, result.pssword, function (err: any, answer: any) {
        if (err) {
          res.sendStatus(404)
        } else if (!answer) {
          res.sendStatus(400)
        } else if (answer) {
          const authData = {
            userID: result.userID,
            userName: result.userName
            // userRole: result.role
          }
          jwt.sign({ authData }, 'secret',{ expiresIn: '1d' }, (_err, token) => {
            res.json({ token })
          })
        } else {
          res.status(400)
        }
      })
    }
  }
)
}
*/
