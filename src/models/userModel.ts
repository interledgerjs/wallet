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
export async function retrieveUser (): Promise<User[]> {
  let result = await knexSelectAll('users')
  if (isUserArray(result)) {
    return (result)
  } else {
    throw new Error('Not user array')
  }
}

// function to handle get user by id
export async function retrieveUserById (id: number): Promise<User> {
  let result = await knexSelectById(id, 'users')
  if (isUserArray(result)) {
    if (result.length > 0) {
      return (result[0])
    } else {
      return (undefined)
    }
  } else {
    throw new Error('Not user array')
  }
}

// function to handle get user by userName
export async function retrieveUserByUserName (userName: string): Promise<User> {
  let result = await knexSelectByUserName(userName, 'users')
  if (isUserArray(result)) {
    if (result.length > 0) {
      return (result[0])
    } else {
      return (undefined)
    }
  } else {
    throw new Error('Not user array')
  }
}

// function to handle adding users
export async function addUser (body: any): Promise<boolean> {
  if (body) {
    const result = await knexInsert(body, 'users')
    return (false)
  } else {
    return (true)
  }
}

// function to handle adding users
export async function addAdmin (body: any): Promise<boolean> {
  const user = await buildUser(body)
  if (user && isUser(user)) {
    let result = await knexInsert(body, 'users')
    return (false)
  } else {
    return (true)
  }
}

export async function modifyUser (userExists: User, body: any): Promise<boolean> {
  if (
      (body.userName === undefined || typeof body.userName === 'string') &&
      (body.dateCreated === undefined || typeof body.dateCreated === 'string') &&
      (body.deletedAt === undefined || typeof body.deletedAt === 'string') &&
      (body.pssword === undefined || typeof body.pssword === 'string')
    ) {
    try {
      let result = await knexUpdateById(body, userExists.id, 'users')
      return (false)
    } catch (error) {
      return (error)
    }
  } else {
    return (true)
  }
}

export async function removeUser (id: number): Promise<boolean> {
  let body = {
    deletedAt: knex.fn.now()
  }
  let result = await knexUpdateById(body, id, 'users')
  return (false)
}

async function buildUser (body: any, baseObj: User = undefined): Promise<User> {
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
      return (userObject)
    } else {
      return (undefined)
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
        throw new Error('Username exists')
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
    return (userObject)
  }
}
