const dotenv = require('dotenv').config()

const makeTransaction = async (knex, debitAccountId, creditAccountId, amount) => {
  await knex('transactions').insert({
    debitAccountId,
    creditAccountId,
    amount
  });
  await knex('accounts').where('id', '=', debitAccountId).decrement('balance', amount)
  await knex('accounts').where('id', '=', creditAccountId).increment('balance', amount)
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('transactions').del()
  // Inserts seed entries
  .then(async function () {
    return makeTransaction(knex, 1,2,100)
  })
  .then(async function () {
    return makeTransaction(knex, 1,3,100)
  })
  .then(async function () {
    return makeTransaction(knex, 1,4,100)
  })
  .then(async function () {
    return makeTransaction(knex, 1,5,100)
  })
  .then(async function () {
    return makeTransaction(knex, 1,6,100)
  })
  .then(async function () {
    return makeTransaction(knex, 2,3,100)
  })
  .then(async function () {
    return makeTransaction(knex, 3,4,100)
  })
  .then(async function () {
    return makeTransaction(knex, 4,5,100)
  })
  .then(async function () {
    return makeTransaction(knex, 5,6,100)
  })
  .then(async function () {
    return makeTransaction(knex, 6,2,100)
  });
};
