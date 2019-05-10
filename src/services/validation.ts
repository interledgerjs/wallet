import { check, validationResult, oneOf, param } from 'express-validator/check'

export const postUserArrayValidation = [
  check('userName').exists().isString().not().isNumeric(),
  check('pssword').exists().isString()
]

export const putUserArrayValidation = [
  check('userName').optional().exists().not().isNumeric(),
  check('pssword').optional().exists().isString(),
  oneOf([
    check('role').optional().equals('user'),
    check('role').optional().equals('admin')
  ]),
  check('deletedAt').optional().matches('false').toBoolean()
]

export const postAccountArrayValidation = [
  check('name').exists().isString(),
  check('owner').exists().isInt()
]

export const putAccountArrayValidation = [
  check('name').optional().isString(),
  param('id').exists().isNumeric()
]

export const postTransactionArrayValidation = [
  check('debitAccountId').exists().isInt(),
  check('creditAccountId').exists().isInt(),
  check('amount').exists().isInt().not().contains('-')
]

export function validate (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // res.status(422).json({ errors: errors.array() })
    res.send(400)
    return false
  } else {
    return true
  }
}
