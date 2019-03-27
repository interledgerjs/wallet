import { Request, Response } from 'express'
import { query } from './db'

export interface User {
  userID: number,
  userName: string,
  dateCreated: string,
  active: boolean,
  pssword: string
}

function isUser (user: any): user is User {
  return (
    typeof user.userID === 'number' &&
    typeof user.userName === 'string' &&
    typeof user.dateCreated === 'string' &&
    typeof user.active === 'boolean' &&
    typeof user.pssword === 'string'
  )
}

function isUserArray (result: any): result is User[] {
  let isUserArray: boolean = true
  result.forEach(function (element) {
    if (!isUser(element)) {
      isUserArray = false
    }
  })
  return (
    isUserArray || result === null
  )
}
// functions

// function to handle getting all users
export function readUser (): Promise<User[]> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM users`
    try {
      const result = await query(sql)
      if (isUserArray(result)) {
        resolve(result)
      } else {
        reject(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle get user by id
export function readUserByID (userID: number): Promise<User> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM users where iserID = '${userID}'`
    try {
      const result = await query(sql)
      if (isUserArray(result)) {
        if (result.length > 0) {
          resolve(result[0])
        } else {
          resolve(null)
        }
      } else {
        reject(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle get user by userName
export function readUserByUserName (userName: string): Promise<User> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM users WHERE username = '${userName}'`
    try {
      const result = await query(sql)
      if (isUserArray(result)) {
        if (result.length > 0) {
          resolve(result[0])
        } else {
          resolve(null)
        }
      } else {
        reject(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle adding users
export function createUser (user: User): Promise<boolean> {
  return new Promise(async function(resolve, reject) {
    if (isUser(user)) {
      const sql: string = `INSERT INTO users (userName, dateCreated, active, pssword) VALUES ('${user.userName}', '${user.dateCreated}', ${user.active}, '${user.pssword}')`
      try {
        const result = query(sql)
        if (isUserArray(result)) {
          resolve(false)
        } else {
          resolve(true)
        }
      } catch (error) {
        reject(error)
      }
    } else {
      resolve(true)
    }
  })
}

export function updateUser (user: User): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `UPDATE users SET userName = '${user.userName}', active = ${user.active}, pssword = '${user.pssword}' WHERE userID = '${user.userID}'`
    try {
      const result = await query(sql)
      resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}

export function deleteUser (userID: number): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `DELETE FROM users WHERE userID = '${userID}'`
    try {
      const result = await query(sql)
      resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}
