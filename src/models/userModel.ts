import * as bcrypt from 'bcrypt'
import { knexSelectByUserName, knexInsert, knexSelectAll, knexSelectById, knexUpdateById } from '../services'
import * as knex from '../../database/knex'
const saltRounds = 3

export interface User {
  userName: string,
  id: number,
  dateCreated: string,
  deletedAt: string,
  role: string,
  pssword: string,
}

// function to handle getting all users
export async function retrieveUsers (): Promise<User[]> {
  const result = await knexSelectAll('users')
  if (result) {
    return (result)
  } else {
    return (undefined)
  }
}

// function to handle get user by id
export async function retrieveUserById (id: number): Promise<User> {
  // result will be empty array or array of one element only
  const result = await knexSelectById(id, 'users')
  if (result[0]) {
    return (result[0])
  } else {
    return (undefined)
  }
}

// function to handle get user by userName
export async function retrieveUserByUserName (userName: string): Promise<User> {
  const result = await knexSelectByUserName(userName, 'users')
  if (result[0]) {
    return (result[0])
  } else {
    return (undefined)
  }
}

// function to handle adding users
export async function addUser (body: any): Promise<User> {
  if (body) {
    body.role = 'user'
    const hashedPssword = await hashing(body.pssword)
    body.pssword = hashedPssword
    const result = await knexInsert(body, 'users')
    return(result[0])
  } else {
    return (undefined)
  }
}

// function to handle adding admin
export async function addAdmin (body: any): Promise<User> {
  if (body) {
    body.role = 'admin'
    const hashedPssword = await hashing(body.pssword)
    body.pssword = hashedPssword
    const result = await knexInsert(body, 'users')
    return(result[0])
  } else {
    return (undefined)
  }
}

// function to handle modifying a user
export async function modifyUser (userExists: User, body: any): Promise<User> {
  if (body) {
    let changes = {} as any
    if (body.userName) {
      const userExists = await retrieveUserByUserName(body.userName)
      if (userExists) {
        return (undefined)
      }
      changes.userName = body.userName
    } if (body.pssword) {
      const hashedPssword = await hashing(body.pssword)
      changes.pssword = hashedPssword
    }
    const result = await knexUpdateById(changes, userExists.id, 'users')
    return (result[0])
  } else {
    return (undefined)
  }
}

// admin function to handle modifying a user
export async function modifyUserAdmin (userExists: User, body: any): Promise<User> {
  if (body) {
    if (body.userName) {
      const userExists = await retrieveUserByUserName(body.userName)
      if (userExists) {
        return (undefined)
      }
    } if (body.pssword) {
      const hashedPssword = await hashing(body.pssword)
      body.pssword = hashedPssword
    }
      // reinstate deleted user
    if (body.deletedAt === false) {
      body.deletedAt = null
    }
    const result = await knexUpdateById(body, userExists.id, 'users')
    return (result[0])
  } else {
    return (undefined)
  }
}

export async function removeUser (id: number): Promise<User> {
  let body = {
    deletedAt: knex.fn.now()
  }
  let result = await knexUpdateById(body, id, 'users')
  return (result[0])
}

export async function hashing (pssword: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(pssword, salt)
  if (hash) {
    return (hash)
  } else {
    return (undefined)
  }
}
