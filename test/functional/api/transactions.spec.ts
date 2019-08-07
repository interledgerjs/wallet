import { assert } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'
import * as knex from '../../../database/knex'
import { knexSelectAll, knexInsert } from '../../../build/services/dbService'
import * as dotenv from 'dotenv'
import { retrieveAccountById } from '../../../src/models'

dotenv.config()

let adminName = 'admin'
let adminPassword = 'admin'
if (process.env.ADMINNAME) {
  adminName = process.env.ADMINNAME
}
if (process.env.ADMINPASSWORD) {
  adminPassword = process.env.ADMINPASSWORD
}

let adminToken
before(function () {
  return request(app)
    .post('/token')
    .send({
      'userName': adminName,
      'pssword': adminPassword
    })
    .then(function (response) {
      adminToken = response.body.token
    })
})
let transactionTestAccount
before(function () {
  return request(app)
    .post('/accounts')
    .send({
      'name': 'transactionTestAccount',
      'owner': 1
    })
    .set('Authorization', 'Bearer ' + adminToken)
    .then(function () {
      return request(app)
      .get('/accounts')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        transactionTestAccount = response.body[1]
      })
    })
})

const database = process.env.DBNAME

const assertFragment = (obj: object, expected: object) => {
  Object.keys(expected).forEach((key: string) => {
    assert.equal(obj[key], expected[key])
  })
}

before(async function () {
  knexInsert([{
    name: 'testAccount1',
    owner: 1
  }, {
    name: 'testAccount2',
    owner: 1
  }], 'accounts')
})

after(function () {
  knex.destroy()
})

describe('.post/transactions', function () {
  afterEach(function () {
    process.env.DBNAME = database
  })

  it('creates transaction and adjusts account balances correctly', async () => {
    const data = {
      'debitAccountId': 1,
      'creditAccountId': transactionTestAccount.id,
      'amount': 100
    }
    const debitAccountBefore = await retrieveAccountById(1)
    const creditAccountBefore = await retrieveAccountById(transactionTestAccount.id)

    const response = await request(app)
                            .post('/transactions')
                            .send(data)
                            .set('Authorization', 'Bearer ' + adminToken)
    assert.equal(response.status, 200)

    const debitAccountAfter = await retrieveAccountById(1)
    const creditAccountAfter = await retrieveAccountById(transactionTestAccount.id)

    assert.equal(debitAccountAfter.balance - debitAccountBefore.balance,-100)
    assert.equal(creditAccountAfter.balance - creditAccountBefore.balance,100)
    assertFragment(response.body, {
      debitAccountId: 1,
      creditAccountId: transactionTestAccount.id,
      amount: 100
    })
  })

  it('fails transaction for non admin if balance drops below 0 for given transaction', async () => {
    const debitAccountBefore = await retrieveAccountById(transactionTestAccount.id)
    const creditAccountBefore = await retrieveAccountById(1)

    const data = {
      'debitAccountId': transactionTestAccount.id,
      'creditAccountId': 1,
      'amount': debitAccountBefore.balance + 1
    }

    const response = await request(app)
      .post('/transactions')
      .send(data)
      .set('Authorization', 'Bearer ' + adminToken)

    assert.equal(response.status, 400)
    const debitAccountAfter = await retrieveAccountById(transactionTestAccount.id)
    const creditAccountAfter = await retrieveAccountById(1)

    assert.equal(debitAccountAfter.balance , debitAccountBefore.balance)
    assert.equal(creditAccountAfter.balance, creditAccountBefore.balance)
  })

  it('should return HTTP 400 when called with bad data', function () {
    let data = {
      'debitAccountId': 1,
      'creditAccountId': transactionTestAccount.id,
      'amount': 'asd'
    }
    return request(app)
      .post('/transactions')
      .send(data)
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })
})

describe('.get/transactions', function () {
  afterEach(function () {
    process.env.DBNAME = database
  })

  it('should return HTTP 200 when db table contains data', function () {
    return request(app)
      .get('/transactions')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 200 when db table is empty', function () {
    process.env.DBNAME = 'emptydb'
    return request(app)
      .get('/transactions')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 200 when querying by valid account', function () {
    return request(app)
      .get('/transactions/?account=1')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return empty object when querying by non-existent account', function () {
    return request(app)
      .get('/transactions/?account=9999')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 200 when querying by valid id', function () {
    return request(app)
      .get('/transactions/1')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 404 when querying by non-existent id', function () {
    return request(app)
      .get('/transactions/999')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})
