import { Request, Response } from 'express'
// import * as Joi from "joi";
import * as jwt from 'jsonwebtoken'

// Being replaced by /login
export let genToken = (req: Request, res: Response) => {
  const UserAdmin = {
    userID: 10,
    userName: 'Johanathan Joestar',
    dateCreated: '1984-04-01',
    active: 1,
    pssword: 'dio',
    userRole: 'Admin'
  }
  jwt.sign(UserAdmin, process.env.SECRETKEY, { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.send(err)
    } else {
      res.json({ token })
    }
  })
}
