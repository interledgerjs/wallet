import * as mysql from 'mysql'
import * as sqlite3 from 'sqlite3'
// const sqlite3:any = require('sqlite3')

let connectServer = (mysql.createConnection({
  host		: 'localhost',
  user		: 'root',
  password	: 'password'
}))

let connectDb = (mysql.createConnection({
  host		: 'localhost',
  user		: 'root',
  password	: 'password',
  database  : 'my_db'
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
      if (err) {
        console.log(err)
      }
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
    serverDB('CREATE DATABASE IF NOT EXISTS my_db', (err) => {
      if (!err) {
        connectDb.query('CREATE TABLE IF NOT EXISTS users (\
          user_id INTEGER AUTO_INCREMENT PRIMARY KEY,\
          user_name VARCHAR(255),\
          date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
          active INTEGER,\
          password VARCHAR(255))', (err) => {
          if (err) throw err
        })
        connectDb.query('CREATE TABLE IF NOT EXISTS accounts (\
          account_id INTEGER AUTO_INCREMENT PRIMARY KEY,\
          account_name VARCHAR(255),\
          owner_user_id INTEGER,\
          balance INTEGER,\
          last_updated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP)', (err) => {
          if (err) throw err
        })
        connectDb.query('CREATE TABLE IF NOT EXISTS transactions (\
          trans_id INTEGER AUTO_INCREMENT PRIMARY KEY,\
          dbt_acc_id INTEGER,\
          crdt_acc_id INTEGER,\
          amount INTEGER,\
          date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP)', (err) => {
          if (err) throw err
        })
      }
    })
  } else {
    console.log('sqlite db building')

    db.serialize(function () {
      db.run('CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(255), date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, active INTEGER, password VARCHAR(255))')
      db.run('CREATE TABLE IF NOT EXISTS accounts (account_id INTEGER PRIMARY KEY AUTOINCREMENT, account_name VARCHAR(255), owner_user_id INTEGER, balance INTEGER, last_updated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP)')
      db.run('CREATE TABLE IF NOT EXISTS transactions (trans_id INTEGER PRIMARY KEY AUTOINCREMENT, dbt_acc_id INTEGER, crdt_acc_id INTEGER, amount INTEGER, date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP)')
    })
  }
}
