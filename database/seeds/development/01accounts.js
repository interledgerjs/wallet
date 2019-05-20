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
  .then(async function () {
    return knex('accounts').insert({
      name: 'home',
      owner: 2
    });
  })
  .then(async function () {
    return knex('accounts').insert({
      name: 'cash',
      owner: 2
    });
  })
  .then(async function () {
    return knex('accounts').insert({
      name: 'fuel',
      owner: 3
    });
  })
  .then(async function () {
    return knex('accounts').insert({
      name: 'food',
      owner: 3
    });
  })
  .then(async function () {
    return knex('accounts').insert({
      name: 'beverages',
      owner: 4
    });
  });
};
