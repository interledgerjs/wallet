import { check, validationResult, oneOf } from 'express-validator/check'

export const postUserArrayValidation = [
  check('userName').exists().not().isNumeric(),
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

export function validate (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return false
  } else {
    return true
  }
}
