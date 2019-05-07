module.exports = {
  client: 'mysql',
  connection: {
    user: 'root',
    password: '',
    database: 'testdb'
  },
  migrations: {
    directory: __dirname + '/database/migrations'
  },
  seeds: {
    directory: __dirname + '/database/seeds'
  }  
}

