const dotenv = require('dotenv').config()

const databasePassword = process.env.DBPASSWORD
const databaseName = process.env.DBNAME
const databaseUser = process.env.DBUSER

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

