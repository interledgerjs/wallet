import { assert } from 'chai';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { mockReq, mockRes} from 'sinon-express-mock'
import * as request from 'supertest';
import * as app from '../../build/app';
import { response } from 'express';
import { verifyToken, Roles } from '../../build/services/jwtService'
require('../../initTestDB')

const adminToken = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk5LCJ1c2VyTmFtZSI6IkZvb0FkbWluIiwidXNlclJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1NTQ4MTM4MjIsImV4cCI6MzU1NDkwMDIyMn0.3BJG7rfkGOwsaZo-34ZAAcCjHhfRF-fEnqfErl8JF6Q'

const userToken = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJpZCI6OTk5OTk5OTk4LCJ1c2VyTmFtZSI6IkZvb1VzZXIiLCJ1c2VyUm9sZSI6InVzZXIifSwiaWF0IjoxNTU0ODEzODIyLCJleHAiOjM1NTQ5MDAyMjJ9.BpE-AsIt-5QLr1YssjMjP7S4NGmtcaV_oOIvKQsNlIA'

describe('Test to create a new user but have it be blocked by middleware', function () {
    before(function () {
      return request(app)
        .get('/users/username/test_user')
        .then(function (response) {
          if (response.body.userName) {
            const id = response.body.id
            return request(app)
              .delete('/users/' + response.body.id)
          }
        })
    })
    let data = {
      "userName": "test_user",
      "pssword": "123",
      "role": "user"
    }
    it('should return OK status', function () {
      return request(app)
        .post('/users')
        .send(data)
        .set('Authorization', 'Bearer ' + adminToken)
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })
  })
