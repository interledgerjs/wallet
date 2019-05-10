import { User, Account } from '../models'

export function filterDeleted (objectArray: User[] | Account[]): Promise<User[] | Account[]> {
  return new Promise(async function (resolve, reject) {
    let returnArray: User[] | Account[] = []
    objectArray.forEach(element => {
      if (!element.deletedAt) {
        returnArray.push(element)
      }
    })
    resolve(returnArray)
  })
}
