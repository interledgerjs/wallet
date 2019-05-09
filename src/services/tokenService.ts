import * as bcrypt from 'bcrypt'
import { User } from '../models'

export function compareHash (userExists: User, pssword: string) {
  const compare = bcrypt.compareSync(pssword, userExists.pssword)
  if (!compare) {
    return (false)
  } else {
    return (true)
  }
}
