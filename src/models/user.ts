import { Request, Response } from 'express'
import * as dbFunctions from '../db'

export interface User {
  userId: number,
  userName: string,
  dateCreated: string,
  active: boolean,
  password: string
}

// functions

// function to handle getting all users
export function readUser (callback: (error: Boolean, result: User[] | null) => void) {
  const sql = `SELECT * FROM users`
  dbFunctions.query(sql, function (err: object, result: User[]) {
    if (err) {
      callback(true, null)
      console.log(err)
    } else {
      callback(false, result)
    }
  })
}

// function to handle get user by id
export function readUserByID (userID: number, callback: (error: Boolean, result: User | null) => void) {
  const sql = `SELECT * FROM users where userID = '${userID}'`
  dbFunctions.query(sql, function (err: object, result: User[]) {
    if (err) {
      callback(true, null)
      console.log(err)
    } else {
      if (result.length > 0) {
        callback(false, result[0])
      } else {
        callback(false, null)
      }
    }
  })
}

// function to handle get user by userName
export function readUserByUsername (userName: string, callback: (error: Boolean, result: User | null) => void) {
  const sql = `SELECT * FROM users where userName = '${userName}'`
  dbFunctions.query(sql, function (err: object, result: User[]) {
    if (err) {
      callback(true, null)
      console.log(err)
    } else {
      if (result.length > 0) {
        callback(false, result[0])
      } else {
        callback(false, null)
      }
    }
  })
}
