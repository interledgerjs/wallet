import * as mysql from 'mysql'
import * as sqlite3 from 'sqlite3'
require('dotenv').config()

export function query (sqlQuery: string): Promise<object[]> {
  return new Promise(function (resolve, reject) {
    if (process.env.ACTIVEDB === 'MySQL') {
      const connectDb = (mysql.createConnection({
        host		: process.env.DBHOST,
        user		: process.env.DBUSER,
        password	: process.env.DBPASSWORD,
        database    : process.env.DBNAME
      }))

      connectDb.query(sqlQuery, function (err: Error, data: object[]) {
        connectDb.end()
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })

    } else {
      let db: any
      if (typeof process.env.DBNAME === 'string') {
        db = new sqlite3.Database(process.env.DBNAME)
      }
      db.all(sqlQuery, function (err: Error, data: object[]) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    }
  })
}
