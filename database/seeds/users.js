const sqlite3 = require('sqlite3')
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 3

if (process.env.ADMINNAME) {
  adminName = process.env.ADMINNAME
} else {
  adminName = 'admin'
}
if (process.env.ADMINPASSWORD) {
  adminPassword = process.env.ADMINPASSWORD
} else {
  adminPassword = 'admin'
}

async function hash () {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash('admin', salt)
  return hash
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(async function () {
      // Inserts seed entries
      return knex('users').insert({
        userName: adminName,
        role: 'admin',
        pssword: await hash()
          });
    });
};
