import { assert, expect } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'

describe('.post/accounts', function () {
  let database = process.env.DBNAME

  let data = {
    'name': 'test_account',
    'owner': 1,
    'balance': 100
  }

  let baddata = {
    'name': 123,
    'owner': 'one',
    'balance': 'one hundred'
  }

  it('should return HTTP 200 when passed good data', function () {
    return request(app)
      .post('/accounts')
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 400 when passed bad data', function () {
    return request(app)
      .post('/accounts')
      .send(baddata)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })

  it('should return HTTP 500 when db cannot be found', function () {
    process.env.DBNAME = ''
    return request(app)
      .post('/accounts')
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })

  afterEach(function () {
    process.env.DBNAME = database
  })
})

describe('.get/accounts', function () {
  let database = process.env.DBNAME
  let id
  let owner

  before(function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        id = response.body[0].id
        owner = response.body[0].owner
      })
  })

  afterEach(function () {
    process.env.DBNAME = database
  })

  it('should return HTTP 200 when db table contains data', function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 404 when db table is empty', function () {
    process.env.DBNAME = 'emptydb'
    return request(app)
      .get('/accounts')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  it('should return HTTP 200 when querying by valid id', function () {
    return request(app)
      .get('/accounts/?id=' + id)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 404 when querying by non-existent id', function () {
    process.env.DBNAME = 'emptydb'
    return request(app)
      .get('/accounts/?id=' + 1)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  it('should return HTTP 500 when db cannot be found', function () {
    process.env.DBNAME = ''
    return request(app)
      .get('/accounts/?id=' + id)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })

  it('should return HTTP 200 when querying by valid owner', function () {
    return request(app)
      .get('/accounts/?owner=' + owner)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 404 status when querying by non-existent owner', function () {
    process.env.DBNAME = 'emptydb'
    return request(app)
      .get('/accounts/?owner=' + 1)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})

describe('.put/accounts', function () {
  let id
  let database = process.env.DBNAME

  let data = {
    'name': 'test_account',
    'owner': 1,
    'balance': 4069
  }

  before(function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        id = response.body[0].id
      })
  })

  afterEach(function () {
    process.env.DBNAME = database
  })

  it('should return HTTP 200 when passed good data', function () {
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 400 when called without defining id', function () {
    id = undefined
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  it('should return HTTP 404 when called with a non-existent id', function () {
    id = (Math.random() * 1000) + 500
    return request(app)
    .put('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  it('should return HTTP 500 when db cannot be found', function () {
    process.env.DBNAME = ''
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })
})

describe('.delete/accounts', function () {
  let id
  let database = process.env.DBNAME

  before(function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        id = response.body[0].id
      })
  })

  afterEach(function () {
    process.env.DBNAME = database
  })

  it('should return HTTP 200 when called with a valid id', function () {
    return request(app)
      .delete('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 400 when called with defining id', function () {
    id = undefined
    return request(app)
    .delete('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })

  it('should return HTTP 404 when called with non-existent id', function () {
    id = (Math.random() * 1000) + 500
    return request(app)
    .delete('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  it('should return HTTP 500 when db cannot be found', function () {
    process.env.DBNAME = ''
    return request(app)
    .delete('/accounts/' + id)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })
})
