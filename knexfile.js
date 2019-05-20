const dotenv = require('dotenv').config()

const databasePassword = process.env.DBPASSWORD
const databaseName = process.env.DBNAME || process.env.MYSQL_DB
const databaseUser = process.env.DBUSER || process.env.MYSQL_USER
const databaseHost = process.env.DBHOST || process.env.MYSQL_HOST

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      user: databaseUser,
      password: databasePassword,
      database: databaseName,
      host: databaseHost
    },
    migrations: {
      directory: __dirname + '/database/migrations'
    },
    seeds: {
      directory: __dirname + '/database/seeds/development'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      user: databaseUser,
      password: databasePassword,
      database: databaseName,
      host: databaseHost
    },
    migrations: {
      directory: __dirname + '/database/migrations'
    },
    seeds: {
      directory: __dirname + '/database/seeds/production'
    }
  }
}
