import {assert} from 'chai';
import { expect } from 'chai'
import * as request from 'supertest';
import * as dlInterface from '../../build/datalayer/dlInterface';

describe('dlInterface ftHandleDelete', function() {
  it('should return a string', function() {
    let options = {
      'table': 'Renzo'
    }
    assert.equal(typeof dlInterface.ftHandleDelete(options), 'string')
  })
})