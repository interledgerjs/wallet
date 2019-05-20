const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 3

adminName = process.env.ADMINNAME || 'admin'
adminPassword = process.env.ADMINPASSWORD || 'admin'

async function hash (pssword) {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(pssword, salt)
  return hash
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
  // Inserts seed entries
  .then(async function () {
    return knex('users')
    .insert({
      userName: adminName,
      role: 'admin',
      pssword: await hash(adminPassword),
    });
  })
  .then(async function () {
    return knex('users')
    .insert({
      userName: 'SteveRogers1918',
      role: 'user',
      pssword: await hash('bucky4ever'),
    });
  })
  .then(async function () {
    return knex('users')
    .insert({
      userName: 'TonyStark1970',
      role: 'user',
      pssword: await hash('iloveyou3000'),
    });
  })
  .then(async function () {
    return knex('users')
    .insert({
      userName: 'StevenStrange1930',
      role: 'user',
      pssword: await hash('shamballa'),
    });
  })
};
