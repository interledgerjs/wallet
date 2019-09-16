exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id')
    table.string('userName')
    table.timestamp('dateCreated').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deletedAt').nullable()
    table.string('role')
    table.string('pssword')
  })
  .createTable('accounts', function (table) {
    table.increments('id')
    table.string('name')
    table.integer('owner').unsigned().references('id').inTable('users')
    table.integer('balance').defaultTo(0)
    table.timestamp('deletedAt').nullable()
    table.timestamp('lastUpdated').notNullable().defaultTo(knex.fn.now())
  })
  .createTable('transactions', function (table) {
    table.increments()
    table.integer('debitAccountId').unsigned().references('id').inTable('accounts')
    table.integer('creditAccountId').unsigned().references('id').inTable('accounts')
    table.integer('amount')
    table.string('description')
    table.timestamp('date').notNullable().defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('transactions')
    .dropTable('accounts')
    .dropTable('users')
};
