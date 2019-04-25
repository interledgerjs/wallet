import { assert } from 'chai'
import { compareHash } from '../../../build/services/tokenService'
import { hashing } from '../../../build/models/userModel'
import { doesNotReject } from 'assert'
import {User} from '../../../build/models/userModel'

describe('unit tests for tokenService', async function () {
  let userObject: User
  before(async function () {
    try {
      userObject = await hashing('panda', 'Harmun')
    } catch (err) {
      throw(err)
    }
  })
  it('should resolve promise as true on password match', async function () {
      try {assert.equal(await compareHash(userObject, 'panda'), true)}
      catch(err) {
        throw(err)
      }
  })
  it('should resolve promise as false on password mismatch', async function () {
    try {
      assert.equal(await compareHash(userObject, 'notpanda'), false)
      } catch (err) {
        throw(err)
    }
  })
})
