import { Request, Response } from 'express'
// import * as jwt from 'jsonwebtoken'
// import * as dlInterface from '../datalayer/dlInterface'
// import * as bcrypt from 'bcrypt'
// const saltRounds = 3
import * as model from '../models/user'

// export let users = (req: Request, res: Response) => {
//   let dataParams = {
//     action: 'get',
//     table: 'users',
//     selectAll: true
//   }
//   dlInterface.handleOp(dataParams, (err, result) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       if (result.length === 0) {
//         res.sendStatus(404)
//       } else {
//         res.json(result)
//       }
//     }
//   })
// }

// export let getuser = (req: Request, res: Response) => {
//   let dataParams = {
//     action: 'get',
//     table: 'users',
//     selectAll: true,
//     filter: [{ field: 'userID', operator: '=', value: req.params.id }]
//   }
//   dlInterface.handleOp(dataParams, (err, result) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       if (result.length === 0) {
//         res.sendStatus(404)
//       } else {
//         res.json(result)
//       }
//     }
//   })
// }

// export let getUserByUserName = (req: Request, res: Response) => {
//   let dataParams = {
//     action: 'get',
//     table: 'users',
//     selectAll: true,
//     filter: [{ field: 'userName', operator: '=', value: req.params.userName }]
//   }
//   dlInterface.handleOp(dataParams, (err, result) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       if (result.length === 0) {
//         res.sendStatus(404)
//       } else {
//         res.json(result)
//       }
//     }
//   })
// }

// export let addUser = (req: Request, res: Response) => {
//   // check if userName already exists
//   let dataParams = {
//     action: 'get',
//     table: 'users',
//     selectAll: true,
//     filter: [{ field: 'userName', operator: '=', value: req.body.userName }]
//   }
//   dlInterface.handleOp(dataParams, (err, result) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       if (result.length === 0) {
//         const pass = req.body.pssword
//         bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
//           if (err) {
//             throw err
//           } else {
//             bcrypt.hash(pass, salt, function (err: any, hash: any) {
//               if (err) {
//                 throw err
//               } else {
//                 req.body.pssword = hash
//                 let dataParams = {
//                   action: 'post',
//                   table: 'users',
//                   parameters: req.body
//                 }
//                 dlInterface.handleOp(dataParams, (err, result) => {
//                   if (err) {
//                     res.status(500).send(err)
//                   } else {
//                     res.send('User added')
//                   }
//                 })

//               }
//             })
//           }
//         })
//       } else {
//         res.json('userName alredy exists')
//       }
//     }
//   })
// }

// export let deluser = (req: Request, res: Response) => {
//   let dataParams = {
//     action: 'get',
//     table: 'users',
//     selectAll: true,
//     filter: [{ field: 'userID', operator: '=', value: req.params.id }]
//   }
//   dlInterface.handleOp(dataParams, (err, result) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       if (result.length === 0) {
//         res.sendStatus(404)
//       } else {
//         let delParams = {
//           action: 'delete',
//           table: 'users',
//           filter: [{ field: 'userID', operator: '=', value: req.params.id }]
//         }
//         dlInterface.handleOp(delParams, (err, result) => {
//           if (err) {
//             res.status(500).send(err)
//           } else {
//             res.send(`user id: ${req.params.id} deleted`)
//           }
//         })
//       }
//     }
//   })
// }

// export let updateuser = (req: Request, res: Response) => {
//   let dataParams = {
//     action: 'put',
//     table: 'users',
//     filter: [{ field: 'userID', operator: '=', value: req.params.id }],
//     parameters: req.body
//   }
//   dlInterface.handleOp(dataParams, (err, result) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       let getParams = {
//         action: 'get',
//         table: 'users',
//         filter: [{ field: 'userID', operator: '=', value: req.params.id }],
//         selectAll: true
//       }
//       dlInterface.handleOp(getParams, (err, result) => {
//         if (err) {
//           res.status(500).send(err)
//         } else {
//           if (result.length === 0) {
//             res.status(404).send('invalid id requested')
//           } else {
//             res.json(result)
//           }
//         }
//       })
//     }
//   })
// }

// export let login = (req: Request, res: Response) => {
//   let pssword = req.body.pssword
//   let dataParams = {
//     action: 'get',
//     table: 'users',
//     selectAll: true,
//     filter: [{ field: 'userName', operator: '=', value: req.params.userName }]
//   }
//   dlInterface.handleOp(dataParams, (err, result) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       bcrypt.compare(pssword, result[0].pssword, function (err: any, answer: any) {
//         if (err) {
//           throw err
//         }
//         if (answer) {
//           const user = {
//             userID: result[0].userID,
//             userName: result[0].userName
//           }
//           jwt.sign({ user }, 'secret',{ expiresIn: '1d' }, (_err, token) => {
//             res.json({ token })
//           })
//         } else {
//           res.json('Invalid pssword.')
//         }
//       })
//     }
//   })
// }

// new controllers

// get /user #returns all users
export function readUser (req: Request, res: Response) {
  model.readUser(function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve users')
    } else {
      if (result.length === 0) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
}

// get /user/id/:id #returns single user by id
export function readUserByID (req: Request, res: Response) {
  const userID: number = req.params.id
  model.readUserByID(userID, function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve user')
    } else {
      if (!result) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
}

// get /user/id/:id #returns single user by userName
export function readUserByUserName (req: Request, res: Response) {
  const userName: string = req.params.username
  model.readUserByUsername(userName, function (error, result) {
    if (error) {
      res.status(500).send('Unable to retrieve user')
    } else {
      if (!result) {
        res.sendStatus(404)
      } else {
        res.send(result)
      }
    }
  })
}

// put /user/:id
export function updateUser (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10)) &&
    (req.body.userName === undefined || typeof req.body.userName === 'string') &&
    (req.body.dateCreated === undefined || typeof req.body.dateCreated === 'string') &&
    (req.body.active === undefined || typeof req.body.active === 'boolean') &&
    (req.body.pssword === undefined || typeof req.body.pssword === 'string')

  ) {
    model.readUserByID(req.params.id, function (error, result) {
      if (error) {
        res.status(500).send('Unable to update user')
      } else {
        if (result) {
          const userObject: model.User = {
            userID: result.userID,
            userName: result.userName,
            dateCreated: result.dateCreated,
            active: result.active,
            pssword: result.pssword
          }
          if (req.body.userName !== undefined) {
            userObject.userName = req.body.userName
          }
          if (req.body.dateCreated !== undefined) {
            userObject.dateCreated = req.body.dateCreated
          }
          if (req.body.active !== undefined) {
            userObject.active = req.body.active
          }
          if (req.body.pssword !== undefined) {
            userObject.pssword = req.body.pssword // need to hash at some point
          }
          model.updateUser(userObject, function (error) {
            if (error) {
              res.status(500).send('Unable to update user')
            } else {
              res.send('Successfully updated user')
            }
          })
        } else {
          res.status(404).send('User does not exist')
        }
      }
    })
  } else {
    res.status(400).send('Bad request')
  }
}

// delete /user/:id
export function deleteUser (req: Request, res: Response) {
  if (
    req.params.id &&
    !isNaN(parseInt(req.params.id, 10))
  ) {
    model.readUserByID(req.params.id, function (error, result) {
      if (error) {
        res.status(500).send('Unable to update user')
      } else {
        if (result) {
          model.deleteUser(req.params.id, function (error) {
            if (error) {
              res.status(500).send('Unable to delete user')
            } else {
              res.send('Successfully deleted user')
            }
          })
        } else {
          res.status(404).send('User does not exist')
        }
      }
    })
  } else {
    res.status(400).send('Bad request')
  }
}
