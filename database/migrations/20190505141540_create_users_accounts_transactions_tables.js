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
    table.integer('balance')
    table.timestamp('deletedAt').nullable()
    table.timestamp('lastUpdated').notNullable().defaultTo(knex.fn.now())

    // table.integer('userId').references('id').inTable('users') // example of foreign key implementation
  })
  .createTable('transactions', function (table) {
    table.increments()
    table.integer('debitAccountId').unsigned().references('id').inTable('accounts')
    table.integer('creditAccountId').unsigned().references('id').inTable('accounts')
    table.integer('amount')
    table.timestamp('date').notNullable().defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('transactions')
    .dropTable('accounts')
    .dropTable('users')
};
