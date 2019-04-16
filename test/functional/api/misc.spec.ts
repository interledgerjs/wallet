import { assert } from 'chai';
import { expect } from 'chai'
import * as request from 'supertest';
import * as app from '../../../build/app';
import { response } from 'express';

// catch all
describe('Test for catching unrecognised endpoint', function () {
  it('should return 404 status', function () {
    return request(app)
      .delete('/apple')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  });
});
