import { assert } from 'chai';
import * as request from 'supertest';
import * as app from '../../build/helpers/jwtTest';
require('../../initTestDB')

const adminToken = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk5LCJ1c2VyTmFtZSI6IkZvb0FkbWluIiwidXNlclJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1NTQ4MTM4MjIsImV4cCI6MzU1NDkwMDIyMn0.3BJG7rfkGOwsaZo-34ZAAcCjHhfRF-fEnqfErl8JF6Q'

const userToken = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk4LCJ1c2VyTmFtZSI6IkZvb1VzZXIiLCJ1c2VyUm9sZSI6InVzZXIifSwiaWF0IjoxNTU0ODEzODIyLCJleHAiOjM1NTQ5MDAyMjJ9.BpE-AsIt-5QLr1YssjMjP7S4NGmtcaV_oOIvKQsNlIA'

const invalidToken= 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk5LCJ1c2VyTmFtZSI6IkZvb0FkbWluIiwidXNlclJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1NTQ4MTM4MjIsImV4cCI6MzU1NDkwMDIyMn0.469fKHKKsRfMyPv_6jBrGmNVSsPqphWNT0PNa-Yv-mQ'

describe('middleware test', function() {
    it('should return function that goes next() once', function () {
        return request(app)
        .get('/testAdmin')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(res => {
            assert.ok(res)
        })
    })
    
    it('should not work without authorization bearer token set', function () {
      return request(app)
      .get('/testAdmin')
      //.expect(403)
      .then(function (response) {
          assert.equal(response.status, 403)
      })
  })
})

  describe('Testing authorisation for admin role', function () {
    
    it('admin token should succeed', function () {
      return request(app)
        .get('/testAdmin')
        // .send(data)
        .set('Authorization', 'Bearer ' + adminToken)
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })

      it('user token should fail', function () {
        return request(app)
          .get('/testAdmin')
          // .send(data)
          .set('Authorization', 'Bearer ' + userToken)
          .then(function (response) {
            assert.equal(response.status, 401)
          })
      })

      it('invalid token should fail', function () {
        return request(app)
          .get('/testAdmin')
          // .send(data)
          .set('Authorization', 'Bearer ' + invalidToken)
          .then(function (response) {
            assert.equal(response.status, 403)
          })
      })

      it('no token should fail', function () {
        return request(app)
          .get('/testAdmin')
          // .send(data)
          .set('Authorization', 'Bearer ')
          .then(function (response) {
            assert.equal(response.status, 403)
          })
      })
  })

  describe('Testing authorisation for user role', function () {
    
    it('admin token should succeed', function () {
      return request(app)
        .get('/testUser')
        // .send(data)
        .set('Authorization', 'Bearer ' + adminToken)
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })

      it('user token should succeed', function () {
        return request(app)
          .get('/testUser')
          // .send(data)
          .set('Authorization', 'Bearer ' + userToken)
          .then(function (response) {
            assert.equal(response.status, 200)
          })
      })

      it('invalid token should fail', function () {
        return request(app)
          .get('/testUser')
          // .send(data)
          .set('Authorization', 'Bearer ' + invalidToken)
          .then(function (response) {
            assert.equal(response.status, 403)
          })
      })

      it('no token should fail', function () {
        return request(app)
          .get('/testUser')
          // .send(data)
          .set('Authorization', 'Bearer ')
          .then(function (response) {
            assert.equal(response.status, 403)
          })
      })
    
    }) 
