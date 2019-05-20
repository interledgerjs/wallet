const dotenv = require('dotenv').config()

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('transactions').del()
  // Inserts seed entries
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 1,
      creditAccountId: 2,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 1,
      creditAccountId: 3,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 1,
      creditAccountId: 4,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 1,
      creditAccountId: 5,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 1,
      creditAccountId: 6,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 2,
      creditAccountId: 3,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 3,
      creditAccountId: 4,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 4,
      creditAccountId: 5,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 5,
      creditAccountId: 6,
      amount: 100
    });
  })
  .then(async function () {
    return knex('transactions').insert({
      debitAccountId: 6,
      creditAccountId: 2,
      amount: 100
    });
  });
};
