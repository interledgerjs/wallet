import { Request, Response } from 'express'
import * as dbFunctions from './db'

export interface User {
  userID: number,
  userName: string,
  dateCreated: string,
  active: boolean,
  pssword: string
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

export function updateUser (user: User, callback: (error: Boolean) => void) {
  const sql = `UPDATE users SET userName = '${user.userName}', active = ${user.active}, pssword = '${user.pssword}' WHERE userID = '${user.userID}'`
  dbFunctions.query(sql, function (err: object) {
    if (err) {
      callback(true)
      console.log(err)
    } else {
      callback(false)
    }
  })
}

export function deleteUser (userID: number, callback: (error: Boolean) => void) {
  const sql = `DELETE FROM users WHERE userID = '${userID}'`
  dbFunctions.query(sql, function (err: object) {
    if (err) {
      callback(true)
      console.log(err)
    } else {
      callback(false)
    }
  })
}
