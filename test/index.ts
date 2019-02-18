const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../app')

describe('Unit testing the /home route', function() {

    it('should return OK status', function() {
      return request(app)
        .get('/home')
        .then(function(response){
            assert.equal(response.status, 200)
        })
    });

    it('should return message on rendering', function() {
      return request(app)
        .get('/home')
        .then(function(response){
            expect(response.text).to.contain('Welcome Home Dude !!');
        })
    });

});
