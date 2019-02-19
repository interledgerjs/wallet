const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../build/app')

describe('Unit testing the /users route', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/users/getbyid/1')
        .then(function(response){
            assert.equal(response.status, 200)
        })
    });
});
