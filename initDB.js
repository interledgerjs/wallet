const mysql = require('mysql')
const sqlite3 = require('sqlite3')
const dotenv = require('dotenv').config()


let mysqlInit = () => {
  return new Promise(function (resolve, reject) {

    let connectServer = (mysql.createConnection({
      host		: process.env.DBHOST,
      user		: process.env.DBUSER,
      password	: process.env.DBPASSWORD,
      insecureAuth : true
    }))
    
    let connectDb = (mysql.createConnection({
      host		: process.env.DBHOST,
      user		: process.env.DBUSER,
      password	: process.env.DBPASSWORD,
      database    : process.env.DBNAME
    }))

    console.log('mysql db building')
    connectServer.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DBNAME}`, (err) => {
      if (!err) {
        connectDb.query('CREATE TABLE IF NOT EXISTS users (\
                    id INT AUTO_INCREMENT PRIMARY KEY,\
                    name VARCHAR(255),\
                    dateCreated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
                    deletedAt DATETIME NOT NULL DEFAULT "",\
                    role VARCHAR(255),\
                    pssword VARCHAR(255));', (err) => {
          if (err) throw err
        })
        connectDb.query('CREATE TABLE IF NOT EXISTS accounts (\
                    id INT AUTO_INCREMENT PRIMARY KEY,\
                    name VARCHAR(255),\
                    owner INT,\
                    balance INT,\
                    deletedAt DATETIME NOT NULL DEFAULT "",\
                    lastUpdated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);', (err) => {
          if (err) throw err
        })
        connectDb.query('CREATE TABLE IF NOT EXISTS transactions (\
                    id INT AUTO_INCREMENT PRIMARY KEY,\
                    debitAccount INT,\
                    creditAccount INT,\
                    amount INT,\
                    date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);', (err) => {
          if (err) throw err
        })
        connectServer.end()
        resolve(connectDb, connectServer)
      }
      else {
        reject(err)
      }
    })
  })
}

if (process.env.ACTIVEDB === 'MySQL') {
  mysqlInit().then(function(connectDb) {
    connectDb.end()
  })
  .catch(function (error) {
    throw error
  })
} else {
  console.log('sqlite db building')

  const db = new sqlite3.Database(process.env.DBNAME)

  db.serialize(function () {
    db.run('CREATE TABLE IF NOT EXISTS users (\
      id INTEGER PRIMARY KEY AUTOINCREMENT,\
      name VARCHAR(255),\
      dateCreated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
      deletedAt DATETIME NOT NULL DEFAULT "",\
      role VARCHAR(255),\
      pssword VARCHAR(255));')
    db.run('CREATE TABLE IF NOT EXISTS accounts (\
      id INTEGER PRIMARY KEY AUTOINCREMENT,\
      name VARCHAR(255),\
      owner INT, balance INT,\
      deletedAt DATETIME NOT NULL DEFAULT "",\
      lastUpdated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);')
    db.run('CREATE TABLE IF NOT EXISTS transactions (\
      id INTEGER PRIMARY KEY AUTOINCREMENT,\
      debitAccount INTEGER,\
      creditAccount INT,\
      amount INTEGER,\
      date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);')
  })
}
