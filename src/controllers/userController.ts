import { Request, Response } from 'express'
import { retrieveUser, retrieveUserByID, retrieveUserByname, addUser, addAdmin, modifyUser, removeUser, User, hashing } from '../models/userModel'

// get /user #returns all users
export async function readUser (req: Request, res: Response) {
  try {
    const result = await retrieveUser()
    if (result.length > 0) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// get /users/id/:id #returns single user by id
export async function readUserByID (req: Request, res: Response) {
  const id: number = req.params.id
  try {
    const result = await retrieveUserByID(id)
    if (result) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// get /users/name/:name #returns single user by name
export async function readUserByname (req: Request, res: Response) {
  const name: string = req.params.name

  try {
    const result = await retrieveUserByname(name)
    if (result) {
      res.send(result)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// post /users #adds new user to table
export async function createUser (req: Request, res: Response) {
  // check if name already exists
  const name: string = req.body.name
  const pssword: string = req.body.pssword
  try {
    const userExists = await retrieveUserByname(name)
    if (!userExists) {
      const userObject = await hashing(pssword, name)
      if (userObject) {
        const result = await addUser(userObject)
        res.sendStatus(200)
      }
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// post /users #adds new admin to table
export async function createAdmin (req: Request, res: Response) {
  // check if name already exists
  const name: string = req.body.name
  const pssword: string = req.body.pssword
  try {
    const userExists = await retrieveUserByname(name)
    if (!userExists) {
      const userObject = await hashing(pssword, name)
      if (userObject) {
        const result = await addAdmin(userObject)
        res.sendStatus(200)
      }
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// put /user/:id
export async function updateUser (req: Request, res: Response) {
  try {
    const userExists = await retrieveUserByID(req.params.id)
    if (userExists) {
      const result = await modifyUser(userExists, req.body)
      if (!result) {
        res.sendStatus(200)
      } else {
        res.sendStatus(404)
      }
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}

// delete /user/:id
export async function deleteUser (req: Request, res: Response) {
  try {
    const userExists = await retrieveUserByID(req.params.id)
    if (userExists) {
      const result = await removeUser(req.params.id)
      if (!result) {
        res.sendStatus(200)
      }
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
  }
}
