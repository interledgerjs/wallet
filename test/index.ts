const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../build/app')

describe('Unit testing the /users route', function() {
    it('should return OK status', function() {
      return request(app)
        .get('/users')
        .then(function(response){
            //console.log(response)
            assert.equal(response.status, 200)
        })
    });
});
