const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../build/app')

// this test uses a preset ID's
// change the test to use whichever ID is assigned by the database

let token

// get token
describe('Test to get get a bearer token', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/getToken')
        .then(function(response){
            assert.equal(response.status, 200)
            token = response.body.token
            // console.log(token)
        })
    });
});

// create a new user
describe('Test to create a new user', function() { 
    let data = {
        "userID": 605,
        "userName": "test_user",
        "password": "test_user",
        "active": 1
    }
    it('should return OK status', function() {
      return request(app)
        .post('/user')
        .send(data)
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// get all users
describe('Test to get all users', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/users')
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// get user by id
describe('Test to get a user by id', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/user/605')
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// update a user
describe('Test to update a user', function() {
    let data = {
        "password": "test_user3",
    }
    it('should return OK status', function() {
        return request(app)
        .put('/user/605')
        .send(data)
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// add account
describe('Test to create a new account', function() { 
    let data = {
        "accountID": 605,
        "accountName": "test_account",
        "ownerUserID": 605
    }
    it('should return OK status', function() {
      return request(app)
        .post('/account')
        .send(data)
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// get all accounts
describe('Test to get all accounts', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/accounts')
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// get account by id
describe('Test to get an account by id', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/account/605')
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// update account
describe('Test to update an account', function() {
    let data = {
        "accountName": "test_account3",
        "ownerUserID": 606
    }
    it('should return OK status', function() {
        return request(app)
        .put('/account/605')
        .send(data)
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// add transaction
describe('Test to create a new transaction', function() { 
    let data = {
        "transID": 605,
        "dbtAccID": 606,
        "crdtAccID": 607,
        "amount": 608
    }
    it('should return OK status', function() {
      return request(app)
        .post('/transaction')
        .send(data)
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// get all transactions
describe('Test to get all transactions', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/transactions')
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// get transaction by id
describe('Test to get a transaction by id', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/transaction/605')
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// update transaction
describe('Test to update a transaction', function() {
    let data = {
        "dbtAccID": 706,
        "crdtAccID": 707,
        "amount": 708
    }
    it('should return OK status', function() {
        return request(app)
        .put('/transaction/605')
        .send(data)
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// delete transaction
describe('Test to delete a transaction', function() {
    it('should return OK status', function() {
      return request(app)
        .delete('/transaction/605')
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// delete account
describe('Test to delete an account', function() {
    it('should return OK status', function() {
      return request(app)
        .delete('/account/605')
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});

// delete a user
describe('Test to delete a user', function() {
    it('should return OK status', function() {
      return request(app)
        .delete('/user/605')
        .set('Authorization', 'Bearer ' + token)
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});
