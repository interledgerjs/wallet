import * as sqlite3 from 'sqlite3'
require('dotenv').config()

export function query (sqlQuery: string): Promise<object[]> {
  return new Promise(function (resolve, reject) {
    if (process.env.DBNAME && process.env.DBNAME !== '') {
      const db = new sqlite3.Database(process.env.DBNAME)
      db.all(sqlQuery, function (err: Error, data: object[]) {
        if (err) {
          console.log(sqlQuery)
          console.log(err)
          reject(err)
        } else {
          resolve(data)
        }
      })
    } else {
      reject('No database')
    }
  })
}
