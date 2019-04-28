import { assert } from 'chai'
import { compareHash } from '../../../build/services/tokenService'
import * as bcrypt from 'bcrypt'
const saltRounds = 3

describe('tokenService', async function () {
  let userObject

  before(async function () {
    try {
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash('panda', salt)
      userObject = {
        id: -1,
        userName: 'harmun',
        dateCreated: new Date().toISOString(),
        deletedAt: '',
        role: '',
        pssword: hash
      }
    } catch (err) {
      throw(err)
    }
  })

  it('should resolve promise as true on password match', async function () {
    try {
      assert.equal(await compareHash(userObject, 'panda'), true)
    } catch (err) {
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
