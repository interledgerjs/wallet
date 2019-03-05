import { Request, Response } from 'express'
import * as dbFunctions from '../db'

interface User {
  userId: number,
  userName: string,
  dateCreated: string,
  active: boolean,
  password: string
}

// functions
function createUser (User: User, callback: (result: User) => void) {
  const sql = `INSERT INTO users (userName, password) VALUES ('${User.userName}', ${User.password})`
  dbFunctions.query(sql, function (err: object) {
    console.log(err)
    if (err) {
      //throw an error
    } else {
      //create that user
    }
  })
}