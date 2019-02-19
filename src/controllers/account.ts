import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as dlInterface from '../datalayer/dlInterface'

// get /account #returns all accounts
export let accounts = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.json(result)
      }
    }
  })
}

// get /account/{1} #returns account with id 1
export let getAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true,
    filter: [{ field: 'account_id', operator: '=', value: req.params.id }]
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.json(result)
      }
    }
  })
}

// post /account #adds new account to table
export let addAccount = (req: Request, res: Response) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {

      let dataParams = {
        action: 'post',
        table: 'accounts',
        parameters: req.body
      }
      dlInterface.handleOp(dataParams, (err, result) => {
        if (err) {
<<<<<<< HEAD
          res.status(500).send(err)
        } else {
          res.send('Account added')
=======
            res.status(403).send(err.message);
        }
        else {
            const schema = Joi.object().keys({
                account_name:Joi.string().required(),
                owner_user_id: Joi.number().required(),
                balance: Joi.number().required()
            });
            const result = Joi.validate(req.body, schema);
        //    console.log(result);
            if (result.error) {
                res.sendStatus(400);
            }
            else {
                let keys: string = "";
                let vals: string = "";
                for (var k in req.body) {
                    keys += `${k},`;
                    vals += `'${req.body[k]}',`
                }
                if (keys.length > 0) keys = keys.slice(0, -1);
                if (vals.length > 0) vals = vals.slice(0, -1);
                dbFunctions.query(`INSERT INTO accounts (${keys}) VALUES (${vals})`, (err) => {
                    if (err)
                        res.status(500).send(err);
                    else 
                        res.send(req.body);
                });
            }
>>>>>>> d2e9b442ee2ad70954e444f6aab2e0205b7b08f7
        }
      })

    }
  })
}

// delete /account/{1} #removes account with id 1
export let delAccount = (req: Request, res: Response) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {
      let dataParams = {
        action: 'get',
        table: 'accounts',
        selectAll: true,
        filter: [{ field: 'account_id', operator: '=', value: req.params.id }]
      }
      dlInterface.handleOp(dataParams, (err, result) => {
        if (err) {
          res.status(500).send(err)
        } else {
          if (result.length === 0) {
            res.sendStatus(404)
          } else {
            let delParams = {
              action: 'delete',
              table: 'accounts',
              filter: [{ field: 'account_id', operator: '=', value: req.params.id }]
            }
            dlInterface.handleOp(delParams, (err, result) => {
              if (err) {
                res.status(500).send(err)
              } else {
                res.send(`account id: ${req.params.id} deleted`)
              }
            })
          }
        }
      })
    }
  })
}

// put /account/{1} #updates account with id 1
export let updateAccount = (req: Request, res: Response) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {
      let dataParams = {
        action: 'put',
        table: 'accounts',
        filter: [{ field: 'account_id', operator: '=', value: req.params.id }],
        parameters: req.body
      }
      dlInterface.handleOp(dataParams, (err, result) => {
        if (err) {
          res.status(500).send(err)
        } else {
          let getParams = {
            action: 'get',
            table: 'accounts',
            filter: [{ field: 'account_id', operator: '=', value: req.params.id }],
            selectAll: true
          }
          dlInterface.handleOp(getParams, (err, result) => {
            if (err) {
              res.status(500).send(err)
            } else {
              if (result.length === 0) {
                res.status(404).send('invalid id requested')
              } else {
                res.json(result)
              }
            }
          })
        }
      })
    }
  })
}
