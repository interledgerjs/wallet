import { Request, Response } from 'express'
// import * as Joi from "joi";
import * as jwt from 'jsonwebtoken'

// Being replaced by /login
export let genToken = (req: Request, res: Response) => {
  jwt.sign({ foo: 'bar' }, process.env.SECRETKEY, { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.send(err)
    } else {
      res.json({ token })
    }
  })
}
