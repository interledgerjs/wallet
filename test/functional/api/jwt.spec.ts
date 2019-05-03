import { assert } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/helpers/jwtTest'
import * as dotenv from 'dotenv'

dotenv.config()
let adminName = 'admin'
let adminPassword = 'admin'
if (process.env.ADMINNAME) {
  adminName = process.env.ADMINNAME
}
if (process.env.ADMINPASSWORD) {
  adminPassword = process.env.ADMINPASSWORD
}
const adminUser = {
  'userName': adminName,
  'pssword': adminPassword
}

let adminToken
let userToken
const invalidToken =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk5LCJ1c2VyTmFtZSI6IkZvb0FkbWluIiwidXNlclJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1NTQ4MTM4MjIsImV4cCI6MzU1NDkwMDIyMn0.469fKHKKsRfMyPv_6jBrGmNVSsPqphWNT0PNa-Yv-mQ'
before(function () {
  return request(app)
    .post('/token')
    .send(adminUser)
    .then(function (response) {
      adminToken = response.body.token
    })
})
before(function () {
  return request(app)
    .post('/users')
    .send({
      'userName': 'user',
      'pssword': 'userPassword'
    })
    .then(function (response) {
      return request(app)
      .post('/token')
      .send({
        'userName': 'user',
        'pssword': 'userPassword'
      })
      .then(function (response) {
        userToken = response.body.token
      })
    })
})

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
