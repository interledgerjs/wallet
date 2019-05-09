const dotenv = require('dotenv').config()

const databasePassword = process.env.DBPASSWORD || MYSQL_PASSWORD
const databaseName = process.env.DBNAME || MYSQL_DB
const databaseUser = process.env.DBUSER || MYSQL_USER

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

