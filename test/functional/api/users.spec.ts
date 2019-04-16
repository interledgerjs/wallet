import { assert } from 'chai';
import * as request from 'supertest';
import * as app from '../../../build/app';

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