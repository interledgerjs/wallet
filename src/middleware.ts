import { Request, Response } from 'express'
import * as jwtVerify from './services/jwtService'

export function mwFunctions (req: Request, res: Response, next: any) {
  jwtVerify.verifyToken(req, res, next)
}
