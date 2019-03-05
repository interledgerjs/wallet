import * as mysql from 'mysql'
import * as sqlite3 from 'sqlite3'
require('dotenv').config()

export let query = (sqlQuery: string, callback: any) => {
  if (process.env.ACTIVEDB === 'MySQL') {

    let connectDb = (mysql.createConnection({
      host		: process.env.DBHOST,
      user		: process.env.DBUSER,
      password	: process.env.DBPASSWORD,
      database    : process.env.DBNAME
    }))

    connectDb.query(sqlQuery, (err, result) => {
      // if (err) console.log(err)
      connectDb.end()
      callback(err, result)
    })

  } else {
    const db: any = new sqlite3.Database(process.env.DBNAME)
    db.all(sqlQuery, (err, result) => {
      if (err) {
        // console.log(err)
      }
      callback(err, result)
    })
  }
}
