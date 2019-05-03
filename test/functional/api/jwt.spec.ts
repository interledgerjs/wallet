import { assert } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/helpers/jwtTest'

const adminToken =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk5LCJ1c2VyTmFtZSI6IkZvb0FkbWluIiwidXNlclJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1NTQ4MTM4MjIsImV4cCI6MzU1NDkwMDIyMn0.3BJG7rfkGOwsaZo-34ZAAcCjHhfRF-fEnqfErl8JF6Q'

const userToken =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk4LCJ1c2VyTmFtZSI6IkZvb1VzZXIiLCJ1c2VyUm9sZSI6InVzZXIifSwiaWF0IjoxNTU0ODEzODIyLCJleHAiOjM1NTQ5MDAyMjJ9.BpE-AsIt-5QLr1YssjMjP7S4NGmtcaV_oOIvKQsNlIA'

const invalidToken =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk5LCJ1c2VyTmFtZSI6IkZvb0FkbWluIiwidXNlclJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1NTQ4MTM4MjIsImV4cCI6MzU1NDkwMDIyMn0.469fKHKKsRfMyPv_6jBrGmNVSsPqphWNT0PNa-Yv-mQ'

describe('verifyToken', function () {
  it('should return function that goes next() once', function () {
    return request(app)
        .get('/testAdmin')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(function (res) {
          assert.ok(res)
        })
  })

  it('should not work without authorization bearer token set', function () {
    return request(app)
      .get('/testAdmin')
      // .expect(403)
      .then(function (response) {
        assert.equal(response.status, 403)
      })
  })
})

describe('Admin authorisation', function () {
  it('should return HTTP 200 when called with a valid admin token', function () {
    return request(app)
        .get('/testAdmin')
        // .send(data)
        .set('Authorization', 'Bearer ' + adminToken)
        .then(function (response) {
          assert.equal(response.status, 200)
        })
  })

  it('should return HTTP 401 when called with a valid user token', function () {
    return request(app)
          .get('/testAdmin')
          // .send(data)
          .set('Authorization', 'Bearer ' + userToken)
          .then(function (response) {
            assert.equal(response.status, 401)
          })
  })

  it('should return HTTP 403 when called with an invalid token', function () {
    return request(app)
          .get('/testAdmin')
          // .send(data)
          .set('Authorization', 'Bearer ' + invalidToken)
          .then(function (response) {
            assert.equal(response.status, 403)
          })
  })

  it('should return HTTP 403 when called without any token', function () {
    return request(app)
          .get('/testAdmin')
          // .send(data)
          .set('Authorization', 'Bearer ')
          .then(function (response) {
            assert.equal(response.status, 403)
          })
  })
})

describe('User authorisation', function () {
  it('should return HTTP 200 when called with a valid admin token', function () {
    return request(app)
        .get('/testUser')
        // .send(data)
        .set('Authorization', 'Bearer ' + adminToken)
        .then(function (response) {
          assert.equal(response.status, 200)
        })
  })

  it('should return HTTP 200 when called with a valid user token', function () {
    return request(app)
          .get('/testUser')
          // .send(data)
          .set('Authorization', 'Bearer ' + userToken)
          .then(function (response) {
            assert.equal(response.status, 200)
          })
  })

  it('should return HTTP 403 when called with an invalid token', function () {
    return request(app)
          .get('/testUser')
          // .send(data)
          .set('Authorization', 'Bearer ' + invalidToken)
          .then(function (response) {
            assert.equal(response.status, 403)
          })
  })

  it('should return HTTP 403 when called without any token', function () {
    return request(app)
          .get('/testUser')
          // .send(data)
          .set('Authorization', 'Bearer ')
          .then(function (response) {
            assert.equal(response.status, 403)
          })
  })
})
