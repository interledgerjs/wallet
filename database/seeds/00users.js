const sqlite3 = require('sqlite3')
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 3

adminName = process.env.ADMINNAME || 'admin'
adminPassword = process.env.ADMINPASSWORD || 'admin'

async function hash () {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(adminPassword, salt)
  return hash
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
  .then(async function () {
    // Inserts seed entries
    return knex('users')
    .insert({
      userName: adminName,
      role: 'admin',
      pssword: await hash(),
    });
  });
};
