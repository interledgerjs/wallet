import { query } from './dbModel'
import * as bcrypt from 'bcrypt'
const saltRounds = 3

export class User {
  constructor (public userName, public userID, public dateCreated, public deletedAt, public userRole, public pssword) {}
}

function isUser (user: any): user is User {
  return (
    typeof user.userID === 'number' &&
    typeof user.userName === 'string' &&
    typeof user.dateCreated === 'string' &&
    typeof user.deletedAt === 'string' &&
    typeof user.userRole === 'string' &&
    typeof user.pssword === 'string'
  )
}

function isUserArray (result: any): result is User[] {
  let isUserArray: boolean = true
  if (result.length) {
    result.forEach(function (element: any) {
      if (!isUser(element)) {
        isUserArray = false
      }
    })
  }
  return (
    isUserArray || result === null
  )
}
// functions

// function to handle getting all users
export function retrieveUser (): Promise<User[]> {
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
export function retrieveUserByID (userID: number): Promise<User> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM users where userID = '${userID}'`
    try {
      const result = await query(sql)
      if (isUserArray(result)) {
        if (result.length > 0) {
          resolve(result[0])
        } else {
          resolve(undefined)
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
export function retrieveUserByUserName (userName: string): Promise<User> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM users WHERE username = '${userName}'`
    try {
      const result = await query(sql)
      if (isUserArray(result)) {
        if (result.length > 0) {
          resolve(result[0])
        } else {
          resolve(undefined)
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
export function addUser (user: User): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (isUser(user)) {
      const sql: string = `INSERT INTO users (userName, dateCreated, deletedAt, userRole, pssword) VALUES ('${user.userName}', '${user.dateCreated}', '', 'user', '${user.pssword}')`
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

// function to handle adding users
export function addAdmin (user: User): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (isUser(user)) {
      const sql: string = `INSERT INTO users (userName, dateCreated, deletedAt, userRole, pssword) VALUES ('${user.userName}', '${user.dateCreated}', '', 'admin', '${user.pssword}')`
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

export async function modifyUser (userExists: User, body: any): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (
    (body.userName === undefined || typeof body.userName === 'string') &&
    (body.dateCreated === undefined || typeof body.dateCreated === 'string') &&
    (body.deletedAt === undefined || typeof body.deletedAt === 'string') &&
    (body.pssword === undefined || typeof body.pssword === 'string')
  ) {
      try {
        const userObject: User = {
          userID: userExists.userID,
          userName: userExists.userName,
          dateCreated: userExists.dateCreated,
          deletedAt: userExists.deletedAt,
          userRole: userExists.userRole,
          pssword: userExists.pssword
        }
        if (body.userName !== undefined) {
          const userNameExists = await retrieveUserByUserName(body.userName)
          if (!userNameExists) {
            userObject.userName = body.userName
          } else {
            reject(true)
          }
        }
        if (body.dateCreated !== undefined) {
          userObject.dateCreated = body.dateCreated
        }
        if (body.deletedAt !== undefined) {
          userObject.deletedAt = body.deletedAt
        }
        if (body.pssword !== undefined) {
          const salt = await bcrypt.genSalt(saltRounds)
          const hash = await bcrypt.hash(body.pssword, salt)
          userObject.pssword = hash
        }
        const sql: string = `UPDATE users SET userName = '${userObject.userName}', deletedAt = '${userObject.deletedAt}', pssword = '${userObject.pssword}' WHERE userID = '${userObject.userID}'`
        const result = await query(sql)
        console.log(result)
        resolve(false)
      } catch (error) {
        reject(error)
      }
    } else {
      reject(true)
    }

  })
}

export function removeUser (id: number): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    try {
      const sql: string = `DELETE FROM users WHERE userID = '${id}'`
      const result = await query(sql)
      resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}

export async function hashing (pssword: string, userName: string): Promise<User> {
  return new Promise(async function (resolve, reject) {
    try {
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(pssword, salt)
      const userObject: User = {
        userID: -1,
        userName: userName,
        dateCreated: new Date().toISOString(),
        deletedAt: '',
        userRole: '',
        pssword: hash
      }
      resolve(userObject)
    } catch (error) {
      reject(error)
    }
  })
}
