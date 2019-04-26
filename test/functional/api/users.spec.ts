import { assert } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'
import expect = require('expect')

// .get('/users')
describe('Test to get all users', function () {
  it('should return 404 status', function () {
    return request(app)
      .get('/users')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})

// .post('/user')
describe('Test to create a new user', function () {
  describe('positive test for creating a user', function () {
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
      'userName': 'test_user',
      'pssword': '123',
      'role': 'admin'
    }
    it('should return OK status', function () {
      return request(app)
        .post('/users')
        .send(data)
        // .set('Authorization', 'Bearer ' + token)
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })
  })
  describe('Negative test for creating a user that already exists', function () {
    let data = {
      'userName': 'test_user',
      'pssword': '123',
      'role': 'admin'
    }
    it('should return 400 status', function () {
      return request(app)
        .post('/users')
        .send(data)
        // .set('Authorization', 'Bearer ' + token)
        .then(function (response) {
          assert.equal(response.status, 400)
        })
    })
  })
  describe('Negative test for creating a user with bad submitted data', function () {
    let data = {
      'userName': 'test_user1',
      'role': 'admin'
    }
    it('should return 400 status', function () {
      return request(app)
        .post('/users')
        .send(data)
        // .set('Authorization', 'Bearer ' + token)
        .then(function (response) {
          assert.equal(response.status, 400)
        })
    })
  })
})

// .post('/admin')
describe('Test to create a new admin', function () {
  describe('positive test for creating a admin', function () {
    let data = {
      'userName': 'test_admin',
      'pssword': '123',
      'role': 'admin'
    }
    it('should return OK status', function () {
      return request(app)
        .post('/admin')
        .send(data)
        // .set('Authorization', 'Bearer ' + token)
        .then(function (response) {
          assert.equal(response.status, 200)
        })
    })
  })
  describe('Negative test for creating a admin that already exists', function () {
    let data = {
      'userName': 'test_admin',
      'pssword': '123',
      'role': 'admin'
    }
    it('should return 400 status', function () {
      return request(app)
        .post('/admin')
        .send(data)
        // .set('Authorization', 'Bearer ' + token)
        .then(function (response) {
          assert.equal(response.status, 400)
        })
    })
  })
//   describe('Negative test for creating a admin with bad submitted data', function () {
//     let data = {
//       "userName": "test_admin1",
//       "role": "admin"
//     }
//     it('should return 400 status', function () {
//       return request(app)
//         .post('/admin')
//         .send(data)
//         // .set('Authorization', 'Bearer ' + token)
//         .then(function (response) {
//           assert.equal(response.status, 400)
//         })
//     })
//   })
})

// .get('/users')
describe('.get/users endpoint', function () {
  let dbname = process.env.DBNAME
  it('should return OK status', function () {
    return request(app)
      .get('/users')
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })
  it('should fail on bad database name', function () {
    process.env.DBNAME = ''
    return request(app)
      .get('/users')
      .then(function (response) {
        assert.equal(response.status, 500)
      })
  })
  after(function () {
    process.env.DBNAME = dbname
  })
})

// .get('/users?id=id')
describe('Test to get a user by id', function () {
  describe('Positive test to get a user by id', function () {
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
				.get('/users?id=' + id)
				.then(function (response) {
  assert.equal(response.status, 200)
})
    })
  })
  describe('Negative test to get a non-existant entry', function () {
    it('should return 404 status', function () {
      return request(app)
				.get('/users?id=' + 9292929)
				.then(function (response) {
  assert.equal(response.status, 404)
})
    })
  })
})

// .get('/users?username=username')
describe('Test to get a user by userName', function () {
  describe('Positive test to get a user by userName', function () {
    let userName
    before(function () {
      return request(app)
				.get('/users')
				.then(function (response) {
  userName = response.body[0].userName
})
    })
    it('should return OK status', function () {
      return request(app)
				.get('/users?username=' + userName)
				.then(function (response) {
  assert.equal(response.status, 200)
})
    })
  })
  describe('Negative test to get a non-existant entry', function () {
    it('should return 404 status', function () {
      return request(app)
				.get('/users?username=' + 'jhfgsxhjb')
				.then(function (response) {
  assert.equal(response.status, 404)
})
    })
  })
})

// .put('/user/:id')
describe('Test to update a user', function () {
  describe('Positive test to update a user', function () {
    let id
    before(function () {
      return request(app)
				.get('/users')
				.then(function (response) {
  id = response.body[0].id
})
    })
    let data = {
      'userName': 'TEST_USER',
      'pssword': '321'
    }
    it('should return OK status', function () {
      return request(app)
				.put('/users/' + id)
				.send(data)
				// .set('Authorization', 'Bearer ' + token)
				.then(function (response) {
  assert.equal(response.status, 200)
})
    })
  })
  describe('Negative test to update a non-existant user', function () {
    let data = {
      'userName': 'TEST_USER',
      'pssword': '321'
    }
    it('should return 404 status', function () {
      return request(app)
				.put('/users/' + 7851365)
				.send(data)
				// .set('Authorization', 'Bearer ' + token)
				.then(function (response) {
  assert.equal(response.status, 404)
})
    })
  })
	// describe('negative test to update a user with bad data', function () {
	// 	let id
	// 	before(function () {
	// 		return request(app)
	// 			.get('/users')
	// 			.then(function (response) {
	// 				id = response.body[0].id
	// 			})
	// 	})
	// 	let data = {
	// 		"userName": 1,
	// 		"pssword": "321"
	// 	}
	// 	it('should return 400 status', function () {
	// 		return request(app)
	// 			.put('/users/' + id)
	// 			.send(data)
	// 			// .set('Authorization', 'Bearer ' + token)
	// 			.then(function (response) {
	// 				assert.equal(response.status, 400)
	// 			})
	// 	})
	// })
})

// .delete('/users/:id')
describe('Test to delete a user', function () {
  describe('Positive test to delete a user', function () {
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
    })
  })
  describe('Negative test to delete a non-exisitant entry', function () {
    it('should return 404 status', function () {
      return request(app)
				.delete('/users/' + 898989898)
				// .set('Authorization', 'Bearer ' + token)
				.then(function (response) {
  assert.equal(response.status, 404)
})
    })
  })
})

describe('.post(/token) endpoint', function () {
  let validUser = {
    'userName': 'TokenUser',
    'pssword': 'mypassword',
    'id': ''
  }
  let invalidUser = {
    'userName': 'NotTokenUser',
    'pssword': 'mypassword',
    'id': ''
  }
  before(function () {
    return request(app)
      .post('/users')
      .send(validUser)
      .then(function () {
        return request(app)
          .get('/users/?username=' + validUser.userName)
          .then(function (response) {
            // console.log(response)
            validUser.id = response.body.id
          })
      })
  })
  it('should return a token when passed valid credentials', function () {
    return request(app)
      .post('/token')
      .send(validUser)
    .then(function (response) {
      assert.equal(response.body.token.length, 185)
      expect(response.body.token).not.toMatch('/ /')
    })
  })
  it('should return a 404 when passed non-existent credentials', function () {
    return request(app)
      .post('/token')
      .send(invalidUser)
    .then(function (response) {
      assert.equal(response.status, 404)
    })
  })
  after(function () {
    return request(app)
      .delete('/users/' + validUser.id)
  })
})
