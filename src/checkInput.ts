import * as Joi from 'joi'

export let valTrans = (req, callback) => {
  let schema = Joi.object().keys({
    transID: Joi.number().optional(),
    dbtAccID: Joi.number(),
    crdtAccID: Joi.number(),
    amount: Joi.number()
  })
  switch (req.method) {
    case ('POST'):
      Joi.validate(req.body, schema, { presence: 'required' }, (error) => {
        callback(error)
      })
      break
    case ('PUT'):
      schema.or('dbtAccID', 'crdtAccID', 'amount')
      Joi.validate(req.body, schema, (error) => {
        callback(error)
      })
      break
    case (req.method):
      callback(null)
  }
}

export let valUser = (req, callback) => {
  let schema = Joi.object().keys({
    userID: Joi.number().optional(),
    userName: Joi.string(),
    active: Joi.number(),
    password: Joi.string()
  })
  switch (req.method) {
    case ('POST'):
      Joi.validate(req.body, schema, { presence: 'required' }, (error) => {
        callback(error)
      })
      break
    case ('PUT'):
      schema.or('userName', 'active', 'password')
      Joi.validate(req.body, schema, (error) => {
        callback(error)
      })
      break
    case (req.method):
      callback(null)
  }
}

export let valAcc = (req, callback) => {
  let schema = Joi.object().keys({
    accountID: Joi.number().optional(),
    accountName: Joi.string(),
    ownerUserID: Joi.number()
  })
  switch (req.method) {
    case ('POST'):
      Joi.validate(req.body, schema, { presence: 'required' }, (error) => {
        callback(error)
      })
      break
    case ('PUT'):
      schema.or('accountName', 'ownerUserID')
      Joi.validate(req.body, schema, (error) => {
        callback(error)
      })
      break
    case (req.method):
      callback(null)
  }
}

export let valLogin = (req, callback) => {
  let schema = Joi.object().keys({
    password: Joi.string()
  })
  switch (req.method) {
    case ('GET'):
      Joi.validate(req.body, schema, { presence: 'required' }, (error) => {
        if (error) {
          callback(error)
        } else {
          Joi.validate(req.params, Joi.object().keys({
            username: Joi.string()
          }).required(), (error) => {
            callback(error)
          })
        }
      })
      break
    case (req.method):
      callback(null)
  }
}
