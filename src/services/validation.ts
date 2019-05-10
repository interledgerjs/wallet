import { check, validationResult, oneOf, param, body } from 'express-validator/check'
import { matchedData } from 'express-validator/filter'

export const postUserInputValidator = [
  check('userName').exists().isString().not().isNumeric(),
  check('pssword').exists().isString()
]

export const putUserInputValidator = [
  check('userName').optional().exists().not().isNumeric(),
  check('pssword').optional().exists().isString(),
  oneOf([
    check('role').optional().equals('user'),
    check('role').optional().equals('admin')
  ]),
  check('deletedAt').optional().matches('false').toBoolean()
]

export const postAccountInputValidator = [
  check('name').exists().isString(),
  check('owner').exists().isInt()
]

export const putAccountInputValidator = [
  check('name').optional().isString(),
  param('id').exists().isNumeric()
]

export const postTransactionInputValidator = [
  check('debitAccountId').exists().isInt(),
  check('creditAccountId').exists().isInt(),
  check('amount').exists().isInt().not().contains('-')
]

export function validate (req, res) {
  const errors = validationResult(req)
  console.log(matchedData(req))
  if (!errors.isEmpty() || Object.keys(matchedData(req)).length === 0) {
    // res.status(422).json({ errors: errors.array() })
    res.sendStatus(400)
    return false
  } else {
    return (matchedData(req))
  }
}
