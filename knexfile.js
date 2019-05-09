const dotenv = require('dotenv').config()

const databasePassword = process.env.DBPASSWORD || process.env.MYSQL_PASSWORD
const databaseName = process.env.DBNAME || process.env.MYSQL_DB
const databaseUser = process.env.DBUSER || process.env.MYSQL_USER

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

