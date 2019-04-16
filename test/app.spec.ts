import { assert } from 'chai';
import { expect } from 'chai'
import * as request from 'supertest';
import * as app from '../build/app';
import { response } from 'express';

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

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1NTA3MTc4MTgsImV4cCI6MTU1MDcyMTQxOH0.YwK3l5zhI7W0qpN-EYvmFFqCSUkKN1Yvmd3KPKfhPxg'

// .post('/transaction')
describe('Test to create a new transaction', function () {
  let data = {
    "debitAccount" : 1,
    "creditAccount" : 2,
    "amount" : 100
    }
  it('should return OK status', function () {
    return request(app)
      .post('/transactions')
      .send(data)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// .get('/transactions')
describe('Test to get all transactions', function () {
  it('should return OK status', function () {
    return request(app)
      .get('/transactions')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// .get('/transactions/?id=1')
describe('Test to get a transaction by id', function () {
  it('should return OK status', function () {
    return request(app)
      .get('/transactions/?id=1')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// .get('/transactions/?account=1')
describe('Test to get a transaction by id', function () {
  it('should return OK status', function () {
    return request(app)
      .get('/transactions/?account=1')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// // .post('/accounts')
// describe('Test to create a new account', function () {
//   let data = {
//     "name": "test_account",
//     "owner": 1,
//     "balance": 100
//   }
//   it('should return OK status', function () {
//     return request(app)
//       .post('/accounts')
//       .send(data)
//       // .set('Authorization', 'Bearer ' + token)
//       .then(function (response) {
//         assert.equal(response.status, 200)
//       })
//   });
// });

// // .get('/accounts')
// describe('Test to get accounts', function () {
//   let id
//   let owner
//   before(function () {
//     return request(app)
//       .get('/accounts')
//       .then(function (response) {
//         id = response.body[0].id
//         owner = response.body[0].owner
//       })
//   })
//   it('should return OK status when querying all', function () {
//     return request(app)
//       .get('/accounts')
//       .then(function (response) {
//         assert.equal(response.status, 200)
//       })
//   })
//   it('should return OK status when querying by id', function () {
//     return request(app)
//       .get('/accounts/?id=' + id)
//       .then(function (response) {
//         assert.equal(response.status, 200)
//       })
//   })
//   it('should return OK status when querying by owner', function () {
//     return request(app)
//       .get('/accounts/?owner=' + owner)
//       .then(function (response) {
//         assert.equal(response.status, 200)
//       })
//   })
// })

// // .put('/accounts/:id')
// describe('Test to update an account', function () {
//   let id
//   before(function () {
//     return request(app)
//       .get('/accounts')
//       .then(function (response) {
//         id = response.body[0].id
//       })
//   })
//   let data = {
//     "name": "test_account",
//     "owner": 1,
//     "balance": 4069
//   }
//   it('should return OK status', function () {
//     return request(app)
//       .put('/accounts/' + id)
//       .send(data)
//       // .set('Authorization', 'Bearer ' + token)
//       .then(function (response) {
//         assert.equal(response.status, 200)
//       })
//   });
// });

// // .delete('/accounts/:id')
// describe('Test to delete an account', function () {
//   let id
//   before(function () {
//     return request(app)
//       .get('/accounts')
//       .then(function (response) {
//         id = response.body[0].id
//       })
//   })
//   it('should return OK status', function () {
//     return request(app)
//       .delete('/accounts/' + id)
//       // .set('Authorization', 'Bearer ' + token)
//       .then(function (response) {
//         assert.equal(response.status, 200)
//       })
//   });
// });

// .post('/user')
describe('Test to create a new user', function () {
  before(function () {
    return request(app)
      .get('/users/username/test_user')
      .then(function (response) {
        if (response.body.userName) {
          const id = response.body.id
          return request(app)
            .delete('/users/' + response.body.id)
        }
      })
  })
  let data = {
    "userName": "test_user",
    "pssword": "123",
    "role": "admin"
  }
  it('should return OK status', function () {
    return request(app)
      .post('/users')
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// .get('/users')
describe('Test to get all users', function () {
  it('should return OK status', function () {
    return request(app)
      .get('/users')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// .get('/users/id/:id')
describe('Test to get a user by id', function () {
  let id
  before(function () {
    return request(app)
      .get('/users')
      .then(function (response) {
        id = response.body[0].id
      })
  })
  it('should return OK status', function () {
    return request(app)
      .get('/users/' + id)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// .put('/user/:id')
describe('Test to update a user', function () {
  let id
  before(function () {
    return request(app)
      .get('/users')
      .then(function (response) {
        id = response.body[0].id
      })
  })
  let data = {
    "userName": "TEST_USER",
    "pssword": "321"
  }
  it('should return OK status', function () {
    return request(app)
      .put('/users/' + id)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

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

// .delete('/users/:id')
describe('Test to delete a user', function () {
  let id
  before(function () {
    return request(app)
      .get('/users')
      .then(function (response) {
        id = response.body[0].id
      })
  })
  it('should return OK status', function () {
    return request(app)
      .delete('/users/' + id)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  });
});

// // catch all
// describe('Test for catching unrecognised endpoint', function () {
//   it('should return 404 status', function () {
//     return request(app)
//       .delete('/apple')
//       .then(function (response) {
//         assert.equal(response.status, 404)
//       })
//   });
// });
