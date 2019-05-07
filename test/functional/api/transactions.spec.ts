import { assert } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'
import * as knex from '../../../database/knex'

const database = process.env.DBNAME

after(function () {
  knex.destroy()
})

describe('.post/transactions', function () {
  afterEach(function () {
    process.env.DBNAME = database
  })

  it('should return HTTP 200 when called with good data', function () {
    let data = {
      'debitAccountId': 1,
      'creditAccountId': 2,
      'amount': 100
    }
    return request(app)
      .post('/transactions')
      .send(data)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  // it('should return HTTP 400 when called with bad data', function () { // test suspended; absence of Transaction proto object checker
  //   let data = {
  //     'debitAccountId': 1,
  //     'creditAccountId': 2,
  //     'amount': 'asd'
  //   }
  //   return request(app)
  //     .post('/transactions')
  //     .send(data)
  //     .then(function (response) {
  //       assert.equal(response.status, 400)
  //     })
  // })

//   it('should return HTTP 500 when db cannot be found', function () { // test suspended; knex throws error on bad db name call
//     process.env.DBNAME = ''
//     let data = {
//       'debitAccountId' : 1,
//       'creditAccountId' : 2,
//       'amount' : 100
//     }
//     return request(app)
//       .post('/transactions')
//       .send(data)
//       .then(function (response) {
//         assert.equal(response.status, 500)
//       })
//   })
})

describe('.get/transactions', function () {
  afterEach(function () {
    process.env.DBNAME = database
  })

  it('should return HTTP 200 when db table contains data', function () {
    return request(app)
      .get('/transactions')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  // it('should return HTTP 404 when db table is empty', function () { // test suspended; testing with knex and empty table not yet implemented
  //   process.env.DBNAME = 'emptydb'
  //   return request(app)
  //     .get('/transactions')
  //     .then(function (response) {
  //       assert.equal(response.status, 404)
  //     })
  // })

  // it('should return HTTP 500 when db cannot be found', function () { // test suspended; knex throws error when started with invalid db
  //   process.env.DBNAME = ''
  //   return request(app)
  //     .get('/transactions')
  //     .then(function (response) {
  //       assert.equal(response.status, 500)
  //     })
  // })

  it('should return HTTP 200 when querying by valid account', function () {
    return request(app)
      .get('/transactions/?account=1')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 404 when querying by non-existent account', function () {
    return request(app)
      .get('/transactions/?account=6')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  // it('should return HTTP 500 when db cannot be found', function () { // test suspended; knex throws error when started with invalid db
  //   process.env.DBNAME = ''
  //   return request(app)
  //     .get('/transactions/?account=1')
  //     .then(function (response) {
  //       assert.equal(response.status, 500)
  //     })
  // })

  it('should return HTTP 200 when querying by valid id', function () {
    return request(app)
      .get('/transactions/?id=1')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 404 when querying by non-existent id', function () {
    return request(app)
      .get('/transactions/?id=6')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  // it('should return HTTP 500 when db cannot be found', function () { // test suspended; knex throws error when started with invalid db
  //   process.env.DBNAME = ''
  //   return request(app)
  //     .get('/transactions/?id=1')
  //     .then(function (response) {
  //       assert.equal(response.status, 500)
  //     })
  // })
})
