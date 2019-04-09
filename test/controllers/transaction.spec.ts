// import * as assert from "assert";
// import * as transaction from '../../build/controllers/transaction'
// import { createTransaction } from "../../build/models/transaction";
// import { constants } from "os";
// require('../../initTestDB')

// process.env.DBNAME = 'testdb'

// class Request {
//   public body
//   constructor(body) {
//     this.body = body
//   }
// }
// class Response {
//   public message
//   public statusCode
//   constuctor() {}
//   public status(statusCode) {
//     this.statusCode = statusCode
//   }
//   public send(message) {
//     this.message = message
//     return(null)
//   }
// }

// let res

// describe('createTransaction', function () {
//   // positive tests
//   beforeEach( function () {
//     res = new Response()
//   })
//   it('should set res message as "Transaction added" (forced id)', function(done) {

//     process.env.DBNAME = 'testdb'
//     let req = new Request({
//       id: 789,
//       debitAccount: 606,
//       creditAccount: 60,
//       amount: 5
//     })

//     res = new Response()

//     console.log(res + res.status() + res.send('dog') + res.message)

//     transaction.createTransaction(req, res)
//     setTimeout(() => {

//       console.log(res + res.status() + res.send('dog') + res.message)

//       assert.equal(res.message, 'Transaction added')
//     }, 1000)
//     done()
//   })
//   it('should set res message as "Transaction added"', function(done) {

//     process.env.DBNAME = 'testdb'
//     let req = new Request({
//       debitAccount: 606,
//       creditAccount: 60,
//       amount: 5
//     })
//     let res = new Response()
//     transaction.createTransaction(req, res)
//     setTimeout(() => {
//       console.log('xxxxxxxxxxxxxxxxxxxxx' + res.message)
//       assert.equal(res.message, 'Transaction added')
//     }, 1000);
//     done()
//   })
  
//   // negative tests
//   // it('should set res statusCode as "500"', function(done) {
//   //   const req = new Request({
//   //     id: 1,
//   //     debitAccount: 606,
//   //     creditAccount: 60,
//   //     amount: 5
//   //   })
//   //   const res = new Response()
//   //   transaction.createTransaction(req, res)
//   //   setTimeout(() => {
//   //     assert.equal(res.statusCode, 500)
//   //   }, 1000);
//   //   done()
//   // })
//   // it('should set res statusCode as "400"', function(done) {
//   //   const req = new Request({
//   //     debitAccount: 606,
//   //     amount: 5
//   //   })
//   //   const res = new Response()
//   //   transaction.createTransaction(req, res)
//   //   setTimeout(() => {
//   //     assert.equal(res.statusCode, 400)
//   //   }, 1000);
//   //   done()
//   // })
  
// })