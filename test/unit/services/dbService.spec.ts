import { assert } from 'chai'
import * as request from 'supertest'
import { query } from '../../../build/services/dbService'

// database query function
describe('Unit tests for dbService.ts', function() {
  describe('Test for database query function', function () {
    it('should reject due to bad sql', async function () {
      let success = true
      try {
        await query('garbage')
      } catch(error) {
        success = false
      }
      assert.equal(success, false)
    })
    it('should return an object on success', async function () {
      let success = true
      try {
        const result = await query('SELECT * FROM accounts')
      } catch(error) {
        success = false
      }
      assert.equal(success, true)
    })
    it('should reject invalid env variable', async function () {
      let success = true
      process.env.DBNAME = ''
      try {
        await query('SELECT * FROM accounts')
      } catch(error) {
        console.log(error)
        success = false
      }
      assert.equal(success, false)
    })
  })
})
