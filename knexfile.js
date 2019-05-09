const dotenv = require('dotenv').config()

const databasePassword = process.env.DBPASSWORD
const databaseName = process.env.DBNAME || process.env.MYSQL_DB
const databaseUser = process.env.DBUSER || process.env.MYSQL_USER

console.log("db pwd: " + databasePassword)
console.log("are empty passwords allowed: " + process.env.MYSQL_ALLOW_EMPTY_PASSWORD)

module.exports = {
  client: 'mysql',
  connection: {
    user: databaseUser,
    password: databasePassword,
    database: databaseName
  },
  migrations: {
    directory: __dirname + '/database/migrations'
  },
  seeds: {
    directory: __dirname + '/database/seeds'
  }  
}

