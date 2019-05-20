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
      name: 'America\'s A**e',
      owner: 2
    });
  })
  .then(async function () {
    return knex('accounts').insert({
      name: 'Vibranium Shield',
      owner: 2
    });
  })
  .then(async function () {
    return knex('accounts').insert({
      name: 'Iron Man Armor MK III',
      owner: 3
    });
  })
  .then(async function () {
    return knex('accounts').insert({
      name: 'Hulkbuster Armor MK II',
      owner: 3
    });
  })
  .then(async function () {
    return knex('accounts').insert({
      name: 'Eye of Agamotto',
      owner: 4
    });
  });
};
