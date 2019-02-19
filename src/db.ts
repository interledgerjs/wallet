import * as mysql from 'mysql'
import * as sqlite3 from 'sqlite3'
// const sqlite3:any = require('sqlite3');

let connectServer = (mysql.createConnection({
  host		: '127.0.0.1',
  user		: 'root',
  password	: 'password',
  insecureAuth : true
}))

let connectDb = (mysql.createConnection({
  host		: '127.0.0.1',
  user		: 'root',
  password	: 'password',
  database    : 'my_db'
}))

const db: any = new sqlite3.Database('accounts')

export let query = (sqlQuery: string, callback: any) => {
  if (process.argv.length > 2 && process.argv[2] === '-mysql') {
    connectDb.query(sqlQuery, (err, result) => {
      if (err) console.log(err)
      callback(err, result)
    })
  } else {
    db.all(sqlQuery, (err, result) => {
      if (err) console.log(err)
      callback(err, result)
    })
  }
}

export let initialise = () => {
  if (process.argv.length > 2 && process.argv[2] === '-mysql') {

    let serverDB = (sqlQuery: string, callback) => {
      connectServer.query(sqlQuery, (err) => {
        if (err) throw err
        callback(err)
      })
    }

    console.log('mysql db building')
    serverDB('CREATE DATABASE IF NOT EXISTS myDB', (err) => {
      if (!err) {
        connectDb.query('CREATE TABLE IF NOT EXISTS users (\
                    userID INT AUTO_INCREMENT PRIMARY KEY,\
                    userName VARCHAR(255),\
                    dateCreated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
                    active INT,\
                    password VARCHAR(255));', (err) => {
          if (err) throw err
        })
        connectDb.query('CREATE TABLE IF NOT EXISTS accounts (\
                    accountID INT AUTO_INCREMENT PRIMARY KEY,\
                    accountName VARCHAR(255),\
                    ownerUserID INT,\
                    balance INT,\
                    lastUpdated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);', (err) => {
          if (err) throw err
        })
        connectDb.query('CREATE TABLE IF NOT EXISTS transactions (\
                    transID INT AUTO_INCREMENT PRIMARY KEY,\
                    dbtAccID INT,\
                    crdtAccID INT,\
                    amount INT,\
                    date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);', (err) => {
          if (err) throw err
        })
      }
    })
  } else {
    console.log('sqlite db building')

    db.serialize(function () {
      db.run('CREATE TABLE IF NOT EXISTS users (\
        userID INTEGER PRIMARY KEY AUTOINCREMENT,\
        userName VARCHAR(255),\
        dateCreated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
        active INTEGER,\
        password VARCHAR(255));')
      db.run('CREATE TABLE IF NOT EXISTS accounts (\
        accountID INTEGER PRIMARY KEY AUTOINCREMENT,\
        accountName VARCHAR(255),\
        ownerUserID INT, balance INT,\
        lastUpdated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);')
      db.run('CREATE TABLE IF NOT EXISTS transactions (\
        transID INTEGER PRIMARY KEY AUTOINCREMENT,\
        dbtAccID INTEGER,\
        crdtAccID INT,\
        amount INTEGER,\
        date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);')
    })
  }
}
