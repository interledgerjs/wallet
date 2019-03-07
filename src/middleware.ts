import { Request, Response } from 'express'
import * as jwtVerify from './services/jwt'

export function mwFunctions (req: Request, res: Response, next: any) {
  jwtVerify.verifyToken(req, res, next)
}
