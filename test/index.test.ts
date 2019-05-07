describe('Functional Tests on Endpoints', () => {
  require('./functional/api/users.spec')
  require('./functional/api/account.spec')
  require('./functional/api/transactions.spec')
  // require('./functional/api/jwt.spec') // test suspended due to breaking other tests
  require('./functional/api/misc.spec')
})

describe('Functional Tests on Model Layer', () => {
  require('./functional/models/transactionModel.spec')
  require('./functional/models/userModel.spec')
})

describe('Unit Tests on Services', () => {
  // require('./unit/services/dbService.spec') // test suspended; current version tests deprecated code
  require('./unit/services/tokenService.spec')
})
