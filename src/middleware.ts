import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as checkInput from './checkInput'

// verifyToken
export let verifyToken = (req: Request, res: Response, next: any) => {
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
                // console.log('Token Verified');
        req.authData = authData
        next()
      }
    })
  } else {
    res.sendStatus(403)
  }
}

// validateData
export let validateData = (req: Request, res: Response, next: any) => {
  const method: string = req.method
  const path: string = req.path.split('/')[1]

  switch (path) {
    case ('user'):
      checkInput.valUser(req, (err) => {
        if (err) {
          res.status(400).send(err.details[0].message)
        } else {
          next()
        }
      })
      break
    case ('transaction'):
      checkInput.valTrans(req, (err) => {
        if (err) {
          res.status(400).send(err.details[0].message)
        } else {
          next()
        }
      })
      break
    case ('account'):
      checkInput.valAcc(req, (err) => {
        if (err) {
          res.status(400).send(err.details[0].message)
        } else {
          next()
        }
      })
      break
    case ('login'):
      checkInput.valLogin(req, (err) => {
        if (err) {
          res.status(400).send(err.details[0].message)
        } else {
          next()
        }
      })
      break
    case (path):
      next()
  }
}
