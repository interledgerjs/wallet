const sqlite3 = require('sqlite3')
const dotenv = require('dotenv').config()

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('accounts').del()
  .then(async function () {
    // Inserts seed entries
    return knex('accounts').insert({
      name: 'Equity',
      owner: 1
    });
  });
};
