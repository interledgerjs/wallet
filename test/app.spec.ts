import {assert} from 'chai';
import { expect } from 'chai'
import * as request from 'supertest';
import * as app from '../build/app';
require('../initTestDB')

// this test uses a preset ID's
// change the test to use whichever ID is assigned by the database

// let token

// // .get('/getToken')
// describe('Test to get get a bearer token', function() {
//   it('should return OK status', function() {
//     return request(app)
//       .get('/getToken')
//       .then(function(response){
//           assert.equal(response.status, 200)
//           token = response.body.token
//           // console.log(token)
//       })
//   });
// });

// .post('/transaction')
describe('Test to create a new transaction', function() { 
  let data = {
      "dbtAccID": 606,
      "crdtAccID": 607,
      "amount": 608
  }
  it('should return OK status', function() {
    return request(app)
      .post('/transactions')
      .send(data)
      .then(function(response){
          assert.equal(response.status, 200)
      })
  });
});

// .get('/transactions')
describe('Test to get all transactions', function() {
  it('should return OK status', function() {
    return request(app)
      .get('/transactions')
      .then(function(response){
          assert.equal(response.status, 200)
      })
  });
});

// // .get('/transaction/id/:id')
// describe('Test to get a transaction by id', function() {
//   it('should return OK status', function() {
//     return request(app)
//       .get('/transactions/id/605')
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .put('/transaction/:id')
// describe('Test to update a transaction', function() {
//   let data = {
//       "dbtAccID": 706,
//       "crdtAccID": 707,
//       "amount": 708
//   }
//   it('should return OK status', function() {
//       return request(app)
//       .put('/transaction/605')
//       .send(data)
//       .set('Authorization', 'Bearer ' + token)
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .delete('/transaction/:id') 
// describe('Test to delete a transaction', function() {
//   it('should return OK status', function() {
//     return request(app)
//       .delete('/transaction/605')
//       .set('Authorization', 'Bearer ' + token)
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .post('/account')
// describe('Test to create a new account', function() { 
//     let data = {
//         "accountID": 605,
//         "accountName": "test_account",
//         "owneruserID": 605
//     }
//     it('should return OK status', function() {
//       return request(app)
//         .post('/account')
//         .send(data)
//         .set('Authorization', 'Bearer ' + token)
//         .then(function(response){
//             //console.log(response)
//             assert.equal(response.status, 200)
//         })
//     });
// });

// // .get('/accounts')
// describe('Test to get all accounts', function() {
//     it('should return OK status', function() {
//       return request(app)
//         .get('/accounts')
//         .then(function(response){
//             //console.log(response)
//             assert.equal(response.status, 200)
//         })
//     });
// });

// // .get('/account/:id')
// describe('Test to get an account by id', function() {
//     it('should return OK status', function() {
//       return request(app)
//         .get('/account/605')
//         .then(function(response){
//             //console.log(response)
//             assert.equal(response.status, 200)
//         })
//     });
// });

// // .put('/account/:id')
// describe('Test to update an account', function() {
//     let data = {
//         "accountName": "test_account3",
//         "owneruserID": 606
//     }
//     it('should return OK status', function() {
//         return request(app)
//         .put('/account/605')
//         .send(data)
//         .set('Authorization', 'Bearer ' + token)
//         .then(function(response){
//             //console.log(response)
//             assert.equal(response.status, 200)
//         })
//     });
// });

// // .delete('/account/:id')
// describe('Test to delete an account', function() {
//   it('should return OK status', function() {
//     return request(app)
//       .delete('/account/605')
//       .set('Authorization', 'Bearer ' + token)
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .post('/user')
// describe('Test to create a new user', function() { 
//   let data = {
//       "userID": 605,
//       "userName": "test_user",
//       "pssword": "test_user",
//       "active": 1
//   }
//   it('should return OK status', function() {
//     return request(app)
//       .post('/user')
//       .send(data)
//       .set('Authorization', 'Bearer ' + token)
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .get('/users')
// describe('Test to get all users', function() {
//   it('should return OK status', function() {
//     return request(app)
//       .get('/users')
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .get('/user/:id')
// describe('Test to get a user by id', function() {
//   it('should return OK status', function() {
//     return request(app)
//       .get('/user/605')
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .put('/user/:id')
// describe('Test to update a user', function() {
//   let data = {
//       "userName": "testuser3",
//   }
//   it('should return OK status', function() {
//       return request(app)
//       .put('/user/605')
//       .send(data)
//       .set('Authorization', 'Bearer ' + token)
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .get('/login/:userName') 
// describe('Test to log a user in', function() {
//   it('should return OK status', function() {
//     return request(app)
//       .get('/login/testuser3')
//       .send({"pssword": "test_user"})
//       .then(function(response){
//           //console.log(response)
//           assert.equal(response.status, 200)
//       })
//   });
// });

// // .delete('/user/:id')
// describe('Test to delete a user', function() {
//     it('should return OK status', function() {
//       return request(app)
//         .delete('/user/605')
//         .set('Authorization', 'Bearer ' + token)
//         .then(function(response){
//             //console.log(response)
//             assert.equal(response.status, 200)
//         })
//     });
// });

// catch all
describe('Test for catching unrecognised endpoint', function() {
  it('should return 404 status', function() {
    return request(app)
      .delete('/apple')
      .then(function(response){
          assert.equal(response.status, 404)
      })
  });
});