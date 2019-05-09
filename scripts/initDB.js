const sqlite3 = require('sqlite3')
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 3

console.log('sqlite db building')

let adminName = 'admin'
let adminPassword = 'admin'
if (process.env.ADMINNAME) {
  adminName = process.env.ADMINNAME
}
if (process.env.ADMINPASSWORD) {
  adminPassword = process.env.ADMINPASSWORD
}

const db = new sqlite3.Database(`${process.env.DBFOLDER}${process.env.DBNAME}`)

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS users (\
    id INTEGER PRIMARY KEY AUTOINCREMENT,\
    userName VARCHAR(255),\
    dateCreated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
    deletedAt DATETIME NOT NULL DEFAULT "",\
    role VARCHAR(255),\
    pssword VARCHAR(255));', async function(err) {
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash('admin', salt)
      if (err) {
        console.log(err)
      } else {
        db.run(`INSERT INTO users (userName, dateCreated, deletedAt, role, pssword) VALUES ('${adminName}', '${new Date().toISOString()}', '', '${adminPassword}', '${hash}')`)
      }
    })
  db.run('CREATE TABLE IF NOT EXISTS accounts (\
    id INTEGER PRIMARY KEY AUTOINCREMENT,\
    name VARCHAR(255),\
    owner INTEGER,\
    deletedAt DATETIME NOT NULL DEFAULT "",\
    lastUpdated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);', async function(err) {
      if (err) {
        console.log(err)
      } else {
        db.run(`INSERT INTO accounts (name, owner, deletedAt, lastUpdated) VALUES ('equity', 1, '', '${new Date().toISOString()}')`)
      }
    })
  db.run('CREATE TABLE IF NOT EXISTS transactions (\
    id INTEGER PRIMARY KEY AUTOINCREMENT,\
    debitAccountId INTEGER,\
    creditAccountId INTEGER,\
    amount INTEGER,\
    date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);')
})
