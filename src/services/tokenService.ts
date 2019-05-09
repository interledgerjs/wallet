import * as bcrypt from 'bcrypt'
import { User } from '../models'

export async function compareHash (userExists: User, pssword: string): Promise<boolean> {
  const compare = bcrypt.compareSync(pssword, userExists.pssword)
  if (!compare) {
    return (false)
  } else {
    return (true)
  }
}
