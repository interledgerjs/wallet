var options = require('../knexfile')
var environment = process.env.NODE_EN || 'development'
var config = options.development
module.exports = require('knex')(config)