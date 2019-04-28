import { assert } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'

const database = process.env.DBNAME

describe('.post/transactions', function () {
  it('should return HTTP 200 when called with good data', function () {
    let data = {
      'debitAccount': 1,
      'creditAccount': 2,
      'amount': 100
    }
    return request(app)
      .post('/transactions')
      .send(data)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 400 when called with bad data', function () {
    let data = {
      'debitAccount': 1,
      'creditAccount': 2,
      'amount': 'asd'
    }
    return request(app)
      .post('/transactions')
      .send(data)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })

  it('should return HTTP 500 when db cannot be found', function () {
    process.env.DBNAME = ''
    let data = {
      'debitAccount' : 1,
      'creditAccount' : 2,
      'amount' : 100
    }
    return request(app)
      .post('/transactions')
      .send(data)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })
})

// .get('/transactions')
describe('Test to get all transactions but return 404 due to no transactions', function () {
  it('1. should return HTTP 404 when db table is empty', function () {
    return request(app)
      .get('/transactions')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})

// .post('/transaction')
describe('Test to create a new transaction', function () {
  afterEach(function () {
    process.env.DBNAME = database
  })
})

// .get('/transactions')
describe('Test to get all transactions', function () {
  it('5. should return HTTP 200 when db table contains data', function () {
    return request(app)
      .get('/transactions')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })
  it('6. should return HTTP 500 when db cannot be found', function () {
    process.env.DBNAME = ''
    return request(app)
      .get('/transactions')
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })
  afterEach(function () {
    process.env.DBNAME = database
  })
})

// .get('/transactions/?id=1')
describe('Tests for getting transactions by id', function () {
  describe('Positive test to get a transaction by id', function () {
    it('7. should return HTTP 200 when querying by valid id', function () {
      return request(app)
        .get('/transactions/?id=1')
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })
  })
  describe('Negative test to get a transaction by id', function () {
    it('8. should return HTTP 404 when querying by non-existent id', function () {
      return request(app)
        .get('/transactions/?id=6')
        .then(function (response) {
          assert.equal(response.status, 404)
        })
    })
  })
  describe('Test to check if there is an error with the data layer', function () {
    it('9. should return HTTP 500 when db cannot be found', function () {
      process.env.DBNAME = ''
      return request(app)
        .get('/transactions/?id=1')
        .then(function (response) {
          assert.equal(response.status, 500)
        })
    })
  })
  afterEach(function () {
    process.env.DBNAME = database
  })
})

// .get('/transactions/?account=1')
describe('Tests for getting transactions by account', function () {
  describe('Positive test to get a transaction by account', function () {
    it('10. should return HTTP 200 when querying by valid account', function () {
      return request(app)
        .get('/transactions/?account=1')
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })
  })
  describe('Negative test to get a transaction by account', function () {
    it('11. should return HTTP 404 when querying by non-existent account', function () {
      return request(app)
        .get('/transactions/?account=6')
        .then(function (response) {
          assert.equal(response.status, 404)
        })
    })
  })
  describe('Test to check if there is an error with the data layer', function () {
    it('12. should return HTTP 500 when db cannot be found', function () {
      process.env.DBNAME = ''
      return request(app)
        .get('/transactions/?account=1')
        .then(function (response) {
          assert.equal(response.status, 500)
        })
    })
  })
  afterEach(function () {
    process.env.DBNAME = database
  })
})
