import { assert } from 'chai'
import { isTransaction, isTransactionArray } from '../../../build/models/transactionModel'

describe('isTransactionArray', function () {
  it('should return false if argument is array of empty objects', function () {
    let result = [{},{},{}]
    assert.equal(isTransactionArray(result), false)
  })
})
