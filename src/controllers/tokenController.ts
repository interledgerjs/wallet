import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { retrieveUserByname } from '../models/userModel'
import { compareHash } from '../models/tokenModel'

// get /token #returns a token
export async function token (req: Request, res: Response) {
  const name: string = req.body.name
  const pssword: string = req.body.pssword
  try {
    const userExists = await retrieveUserByname(name)
    if (userExists) {
      const result = await compareHash(userExists, pssword)
      if (result) {
        const authData = {
          id: userExists.id,
          name: userExists.name
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
