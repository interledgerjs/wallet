import { Request, Response } from 'express'
import * as dbFunctions from '../db'
import * as Joi from 'joi'
import * as jwt from 'jsonwebtoken'

export let getUserByUserId = (req: Request, res: Response) => {
  dbFunctions.query(`SELECT * FROM users WHERE userID = '${req.params.userID}'`, (err, result) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.json(result)
    }
  })
}

export let getUserByUserName = (req: Request, res: Response) => {
  dbFunctions.query(`SELECT * FROM users WHERE userName = '${req.params.userName}'`, (err, result) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.json(result)
    }
  })
}

export let createNewUser = (req: Request, res: Response) => {
  dbFunctions.query(`INSERT INTO users (userName, dateCreated, active) VALUES ('${req.params.userName}', DEFAULT, 1)`, (err, result) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.json(result)
    }
  })
}

export let deactivateStatusOfUserId = (req: Request, res: Response) => {
  dbFunctions.query(`UPDATE users SET active = 0 WHERE userID = '${req.params.userID}'`, (err, result) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.json(result)
    }
  })
}
