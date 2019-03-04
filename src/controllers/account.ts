import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as dlInterface from '../datalayer/dlInterface'

// get /account #returns all accounts
export let readAllAccount = (req: Request, res: Response) => {
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

export let readAllAccountByUserId = () => {
  const placeholder = 1
  console.log(placeholder)
}

// get /account/{1} #returns account with id 1
export let readAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true,
    filter: [{ field: 'accountID', operator: '=', value: req.params.id }]
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
export let createAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'post',
    table: 'accounts',
    parameters: req.body
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send('Account added')
    }
  })

}

// delete /account/{1} #removes account with id 1
export let deleteAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'get',
    table: 'accounts',
    selectAll: true,
    filter: [{ field: 'accountID', operator: '=', value: req.params.id }]
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
          filter: [{ field: 'accountID', operator: '=', value: req.params.id }]
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

// put /account/{1} #updates account with id 1
export let updateAccount = (req: Request, res: Response) => {
  let dataParams = {
    action: 'put',
    table: 'accounts',
    filter: [{ field: 'accountID', operator: '=', value: req.params.id }],
    parameters: req.body
  }
  dlInterface.handleOp(dataParams, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      let getParams = {
        action: 'get',
        table: 'accounts',
        filter: [{ field: 'accountID', operator: '=', value: req.params.id }],
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
