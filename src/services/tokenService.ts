import * as bcrypt from 'bcrypt'
import { User } from '../models'

export function compareHash (userExists: User, pssword: string) {
  return new Promise(function (resolve, reject) {
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
