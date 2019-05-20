const dotenv = require('dotenv').config()

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('accounts').del()
  // Inserts seed entries
  .then(async function () {
    return knex('accounts').insert({
      name: 'Equity',
      owner: 1
    });
  })
};
