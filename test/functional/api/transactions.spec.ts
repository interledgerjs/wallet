import { assert } from 'chai';
import * as request from 'supertest';
import * as app from '../../../build/app';

// .get('/transactions')
describe('Test to get all transactions but return 404 due to no transactions', function () {
  it('should return 404 status', function () {
    return request(app)
      .get('/transactions')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  });
});

// .post('/transaction')
describe('Test to create a new transaction', function () {
  describe('Positive test to create a new transaction', function() {
    let data = {
      "debitAccount" : 1,
      "creditAccount" : 2,
      "amount" : 100
      }
    it('should return OK status', function () {
      return request(app)
        .post('/transactions')
        .send(data)
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })
  })
  describe('Negative test to create a transaction with invalid data', function() {
    let data = {
      "debitAccount" : 1,
      "creditAccount" : 2,
      "amount" : 'asd'
      }
    it('should return Bad user input status', function () {
      return request(app)
        .post('/transactions')
        .send(data)
        .then(function (response) {
          assert.equal(response.status, 400)
        })
    })
  })
})

// .get('/transactions')
describe('Test to get all transactions', function () {
  it('should return OK status', function () {
    return request(app)
      .get('/transactions')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// .get('/transactions/?id=1')
describe('Tests for getting transactions by id', function() {
  describe('Positive test to get a transaction by id', function () {
    it('should return OK status', function () {
      return request(app)
        .get('/transactions/?id=1')
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })
  })
  describe('Negative test to get a transaction by id', function () {
    it('should return 404 status', function () {
      return request(app)
        .get('/transactions/?id=6')
        .then(function (response) {
          assert.equal(response.status, 404)
        })
    })
  })
})


// .get('/transactions/?account=1')
describe('Tests for getting transactions by account', function() {
  describe('Positive test to get a transaction by account', function () {
    it('should return OK status', function () {
      return request(app)
        .get('/transactions/?account=1')
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })
  })
  describe('Negative test to get a transaction by account', function () {
    it('should return 404 status', function () {
      return request(app)
        .get('/transactions/?account=6')
        .then(function (response) {
          assert.equal(response.status, 404)
        })
    })
  })
})