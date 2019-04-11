import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { retrieveUserByUserName } from '../models/userModel'
import { compareHash } from '../models/tokenModel'

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
          userRole: userExists.role
        }
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
    res.sendStatus(500)
  }
}
