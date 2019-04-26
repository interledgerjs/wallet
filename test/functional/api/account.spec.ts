import { assert, expect } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'

describe('Testing switch statements pre-database', function () {
  let id = 1
  let owner = 1

  it('should return 404 status when querying all', function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
  it('should return 404 status when querying by id', function () {
    return request(app)
      .get('/accounts/?id=' + id)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
  it('should return 404 status when querying by owner', function () {
    return request(app)
      .get('/accounts/?owner=' + owner)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})

// .post('/accounts')
describe('Test to create a new account', function () {
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
  it('should return OK status', function () {
    return request(app)
      .post('/accounts')
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return 400 status', function () {
    return request(app)
      .post('/accounts')
      .send(baddata)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })

  it('should return 500 if an error with data layer', function () {
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

// .get('/accounts')
describe('Test to get accounts', function () {
  let id
  let owner
  let database = process.env.DBNAME
  before(function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        id = response.body[0].id
        owner = response.body[0].owner
      })
  })
  it('should return OK status when querying all', function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })
  it('should return OK status when querying by id', function () {
    return request(app)
      .get('/accounts/?id=' + id)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })
  it('should return OK status when querying by owner', function () {
    return request(app)
      .get('/accounts/?owner=' + owner)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return 500 if an error with data layer', function () {
    process.env.DBNAME = ''
    return request(app)
      .get('/accounts/?id=' + id)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })

  afterEach(function () {
    process.env.DBNAME = database
  })
})

// .put('/accounts/:id')
describe('Test to update an account', function () {
  let id
  let database = process.env.DBNAME
  before(function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        id = response.body[0].id
      })
  })
  let data = {
    'name': 'test_account',
    'owner': 1,
    'balance': 4069
  }

  it('should return OK status', function () {
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return 500 if an error with data layer', function () {
    process.env.DBNAME = ''
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })

  it('should return 400 if ID is undefined', function () {
    id = undefined
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  it('should return 404 if account does not exist', function () {
    id = (Math.random() * 1000) + 500
    return request(app)
    .put('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  afterEach(function () {
    process.env.DBNAME = database
  })
})

// .delete('/accounts/:id')
describe('Test to delete an account', function () {
  let id
  let database = process.env.DBNAME
  before(function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        id = response.body[0].id
      })
  })

  it('should return OK status', function () {
    return request(app)
      .delete('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return 500 if an error with data layer', function () {
    process.env.DBNAME = ''
    return request(app)
    .delete('/accounts/' + id)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })

  it('should return 400 if ID is undefined', function () {
    id = undefined
    return request(app)
    .delete('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })

  it('should return 404 if account does not exist', function () {
    id = (Math.random() * 1000) + 500
    return request(app)
    .delete('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  afterEach(function () {
    process.env.DBNAME = database
  })
})
