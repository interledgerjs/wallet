import { assert, expect } from 'chai'
import { query } from '../../../build/services/dbService'

// database query function
describe('dbService', function () {
  let database = process.env.DBNAME

  afterEach(function () {
    process.env.DBNAME = database
  })

  it('should reject due to bad sql', async function () {
    let err
    let result
    try {
      result = await query('garbage')
    } catch (error) {
      err = error
    }
    assert.equal(err.code, 'SQLITE_ERROR')
    expect(result).to.be.an('undefined')
  })

  it('should return true when called with a valid query', async function () {
    let result
    try {
      result = await query('SELECT * FROM accounts')
    } catch (error) {
      throw(error)
    }
    expect(result).to.be.an('array')
  })

  it('should reject invalid env variable', async function () {
    process.env.DBNAME = ''
    let err
    try {
      await query('SELECT * FROM accounts')
    } catch (error) {
      err = error
    }
    assert.equal(err, 'No database')
  })
})
