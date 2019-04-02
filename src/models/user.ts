import { query } from './db'

export interface User {
  userID: number,
  userName: string,
  dateCreated: string,
  deletedAt: string,
  role: string
  pssword: string
}

function isUser (user: any): user is User {
  return (
    typeof user.userID === 'number' &&
    typeof user.userName === 'string' &&
    typeof user.dateCreated === 'string' &&
    typeof user.deletedAt === 'string' &&
    typeof user.role === 'string' &&
    typeof user.pssword === 'string'
  )
}

function isUserArray (result: any): result is User[] {
  let isUserArray: boolean = true
  if (result.length) {
    result.forEach(function (element) {
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
export function retrieveUserByUserName (userName: string): Promise<User> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `SELECT * FROM users WHERE username = '${userName}'`
    try {
      const result = await query(sql)
      console.log(result)
      if (isUserArray(result)) {
        if (result.length > 0) {
          resolve(result[0])
        } else {
          resolve(null)
        }
      } else {
        console.log(isUserArray(result))
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
      const sql: string = `INSERT INTO users (userName, dateCreated, deletedAt, role, pssword) VALUES ('${user.userName}', '${user.dateCreated}', '${user.deletedAt}', '${user.role}', '${user.pssword}')`
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

export function alterUser (user: User): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    const sql: string = `UPDATE users SET userName = '${user.userName}', deletedAt = '${user.deletedAt}', role = '${user.role}', pssword = '${user.pssword}' WHERE userID = '${user.userID}'`
    try {
      const result = await query(sql)
      resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}

export function removeUser (userID: number): Promise<boolean> {
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
