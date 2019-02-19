import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as dlInterface from '../datalayer/dlInterface'

export let users = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'users',
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

export let getuser = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'users',
    selectAll: true,
    filter: [{ field: 'user_id', operator: '=', value: req.params.id }]
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

export let adduser = (req: Request, res: Response) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {

      let dataParams = {
        action: 'post',
        table: 'users',
        parameters: req.body
      }
      dlInterface.handleOp(dataParams, (err, result) => {
        if (err) {
<<<<<<< HEAD
          res.status(500).send(err)
        } else {
          res.send('User added')
=======
            res.status(403).send(err.message);
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
                dbFunctions.query(`INSERT INTO users (${keys}) VALUES (${vals})`, (err) => {
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(req.body);
                });
            
>>>>>>> d2e9b442ee2ad70954e444f6aab2e0205b7b08f7
        }
      })

    }
  })

}

export let deluser = (req: Request, res: Response) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {
      let dataParams = {
        action: 'get',
        table: 'users',
        selectAll: true,
        filter: [{ field: 'user_id', operator: '=', value: req.params.id }]
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
              table: 'users',
              filter: [{ field: 'user_id', operator: '=', value: req.params.id }]
            }
            dlInterface.handleOp(delParams, (err, result) => {
              if (err) {
                res.status(500).send(err)
              } else {
                res.send(`user id: ${req.params.id} deleted`)
              }
            })
          }
        }
      })
    }
  })
}

export let updateuser = (req: Request, res: Response) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      res.status(403).send(err.message)
    } else {
      let dataParams = {
        action: 'put',
        table: 'users',
        filter: [{ field: 'user_id', operator: '=', value: req.params.id }],
        parameters: req.body
      }
      dlInterface.handleOp(dataParams, (err, result) => {
        if (err) {
          res.status(500).send(err)
        } else {
          let getParams = {
            action: 'get',
            table: 'users',
            filter: [{ field: 'user_id', operator: '=', value: req.params.id }],
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
