<<<<<<< HEAD
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
=======
import { Request, Response} from "express";
import * as jwt from "jsonwebtoken";
>>>>>>> d2e9b442ee2ad70954e444f6aab2e0205b7b08f7

// verifyToken
export let verifyToken = (req: Request, res: Response, next: any) => {
  const bearerHeader: string = req.headers['authorization']
  if (bearerHeader) {
        // pulls token out of header
    const bearer: string[] = bearerHeader.split(' ')
    const bearerToken: string = bearer[1]
    req['token'] = bearerToken

        // verifies token and returns authData
    jwt.verify(req.token, 'secret', { algorithms: ['HS256'] }, (err: Error, authData) => {
      if (err) {
        res.sendStatus(403)
      } else {
                // console.log('Token Verified');
        next()
      }
    })

  } else {
    res.sendStatus(403)
  }
}
