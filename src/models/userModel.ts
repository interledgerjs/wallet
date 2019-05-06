import * as bcrypt from 'bcrypt'
import { query, knexSelectByUserName, knexInsert, knexSelectAll, knexSelectById, knexUpdateById } from '../services'
const saltRounds = 3

export interface User {
  userName: string,
  id: number,
  dateCreated: string,
  deletedAt: string,
  role: string,
  pssword: string,
}

function isUser (user: any): user is User {
  return (
    typeof user.id === 'number' &&
    typeof user.userName === 'string' &&
    typeof user.dateCreated === 'string' &&
    (typeof user.deletedAt === 'object' || typeof user.deletedAt === 'string') &&
    typeof user.role === 'string' &&
    typeof user.pssword === 'string'
  )
}

export function isUserArray (result: any): result is User[] {
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

// function to handle getting all users
export function retrieveUser (): Promise<User[]> {
  return new Promise(async function (resolve, reject) {
    try {
      let result = await knexSelectAll('users')
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
export function retrieveUserById (id: number): Promise<User> {
  return new Promise(async function (resolve, reject) {
    // const sql: string = `SELECT * FROM users where id = '${id}' AND deletedAt = ''`
    try {
      // const result = await query(sql)
      let result = await knexSelectById(id, 'users')
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
    // const sql: string = `SELECT * FROM users WHERE username = '${userName}' AND deletedAt = ''`
    try {
      // const result = await query(sql)
      let result = await knexSelectByUserName(userName, 'users')
      // console.log('parsing done')
      // Object.keys(result[0]).forEach(function (key) {
      //   console.log(key)
      //   console.log(typeof result[0][key])
      // })
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
export function addUser (body: any): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    try {
      if (body) { // add proto object checker
        const result = await knexInsert(body, 'users')
        // console.log(result) // this shows return value of knexInsert()
        resolve(false)
      } else {
        resolve(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// function to handle adding users
export function addAdmin (body: any): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    try {
      const user = await buildUser(body)
      if (user && isUser(user)) {
        const sql: string = `INSERT INTO users (userName, dateCreated, deletedAt, role, pssword) VALUES ('${user.userName}', '${user.dateCreated}', '', 'admin', '${user.pssword}')`
        const result = await query(sql)
        resolve(false)
      } else {
        resolve(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function modifyUser (userExists: User, body: any): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    if (
      (body.userName === undefined || typeof body.userName === 'string') &&
      (body.dateCreated === undefined || typeof body.dateCreated === 'string') &&
      (body.deletedAt === undefined || typeof body.deletedAt === 'string') &&
      (body.pssword === undefined || typeof body.pssword === 'string')
    ) {
      try {
        // const userObject = await buildUser(body, userExists)
        // const sql: string = `UPDATE users SET userName = '${userObject.userName}', deletedAt = '${userObject.deletedAt}', pssword = '${userObject.pssword}' WHERE id = '${userObject.id}'`
        // const result = await query(sql)
        let result = await knexUpdateById(body, userExists.id, 'users')
        resolve(false)
      } catch (error) {
        reject(error)
      }
    } else {
      resolve(true)
    }

  })
}

export function removeUser (id: number): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    try {
      const sql: string = `UPDATE users SET deletedAt = '${new Date().toISOString()}' where id = '${id}'`
      const result = await query(sql)
      resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}

function buildUser (body: any, baseObj: User = undefined): Promise<User> {
  return new Promise(async function (resolve, reject) {
    try {
      if (baseObj === undefined) {
        if (typeof(body.pssword) === 'string') {
          const salt = await bcrypt.genSalt(saltRounds)
          const hash = await bcrypt.hash(body.pssword, salt)
          const userObject: User = {
            id: -1,
            userName: body.userName,
            dateCreated: new Date().toISOString(),
            deletedAt: '',
            role: '',
            pssword: hash
          }
          resolve(userObject)
        } else {
          resolve(undefined)
        }
      } else {
        const userObject: User = {
          id: baseObj.id,
          userName: baseObj.userName,
          dateCreated: baseObj.dateCreated,
          deletedAt: baseObj.deletedAt,
          role: baseObj.role,
          pssword: baseObj.pssword
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
        resolve(userObject)
      }
    } catch (error) {
      reject(error)
    }
  })
}
