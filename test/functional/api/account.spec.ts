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

describe('Testing switch statements pre-database', function () {
  let id = 1
  let owner = 1

  it('1. should return HTTP 404 when db table is empty', function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
  it('2. should return HTTP 404 when querying by non-existent id', function () {
    return request(app)
      .get('/accounts/?id=' + 1)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
  it('3. should return HTTP 404 status when querying by non-existent owner', function () {
    return request(app)
      .get('/accounts/?owner=' + 1)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})

// .post('/accounts')
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
  it('4. should return HTTP 200 when passed good data', function () {
    return request(app)
      .post('/accounts')
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('5. should return HTTP 400 when passed bad data', function () {
    return request(app)
      .post('/accounts')
      .send(baddata)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })

  it('6. should return HTTP 500 when db cannot be found', function () {
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
  it('7. should return HTTP 200 when db table contains data', function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })
  it('8. should return HTTP 200 when querying by valid id', function () {
    return request(app)
      .get('/accounts/?id=' + id)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })
  it('9. should return HTTP 200 when querying by valid owner', function () {
    return request(app)
      .get('/accounts/?owner=' + owner)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('10. should return HTTP 500 when db cannot be found', function () {
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

  it('11. should return HTTP 200 when passed good data', function () {
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('12. should return HTTP 500 when db cannot be found', function () {
    process.env.DBNAME = ''
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })

  it('13. should return HTTP 400 when called without defining id', function () {
    id = undefined
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  it('14. should return HTTP 404 when called with a non-existent id', function () {
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

  it('15. should return HTTP 200 when called with a valid id', function () {
    return request(app)
      .delete('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('16. should return HTTP 500 when db cannot be found', function () {
    process.env.DBNAME = ''
    return request(app)
    .delete('/accounts/' + id)
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })

  it('17. should return HTTP 400 when called with defining id', function () {
    id = undefined
    return request(app)
    .delete('/accounts/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })

  it('18. should return HTTP 404 when called with non-existent id', function () {
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
