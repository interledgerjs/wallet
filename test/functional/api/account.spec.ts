import { assert } from 'chai';
import { expect } from 'chai'
import * as request from 'supertest';
import * as app from '../../../build/app';
import { response } from 'express';

// .post('/accounts')
describe('Test to create a new account', function () {
  let data = {
    "name": "test_account",
    "owner": 1,
    "balance": 100
  }
  it('should return OK status', function () {
    return request(app)
      .post('/accounts')
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// .get('/accounts')
describe('Test to get accounts', function () {
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
})

// .put('/accounts/:id')
describe('Test to update an account', function () {
  let id
  before(function () {
    return request(app)
      .get('/accounts')
      .then(function (response) {
        id = response.body[0].id
      })
  })
  let data = {
    "name": "test_account",
    "owner": 1,
    "balance": 4069
  }
  it('should return OK status', function () {
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });

  it('should return 400 status if no ID given', function () {
    id = undefined
    return request(app)
      .put('/accounts/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  });
});

// .delete('/accounts/:id')
describe('Test to delete an account', function () {
  let id
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
  });
});

