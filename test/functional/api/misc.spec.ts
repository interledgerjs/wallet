import { assert, expect } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'
import { response } from 'express'

// catch all
describe('callint the api with an unrecognised endpoint', function () {
  it('should return HTTP 404', function () {
    return request(app)
      .delete('/apple')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})
