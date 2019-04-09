import { User, retrieveUserByname } from '../models/userModel'
import * as bcrypt from 'bcrypt'
import { token } from '../controllers/tokenController'

export async function compareHash (userExists: User, pssword: string) {
  return new Promise(async function (resolve, reject) {
    try {
      const compare = bcrypt.compareSync(pssword, userExists.pssword)
      if (!compare) {
        resolve(false)
      } else {
        resolve(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}
