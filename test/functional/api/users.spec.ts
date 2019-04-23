import { assert } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'

// .get('/users')
describe('Test to get all users', function () {
  it('should return 404 status', function () {
    return request(app)
      .get('/users')
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  });
});

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
    })
  })
  describe('Negative test for creating a user that already eists', function () {
    let data = {
      "userName": "test_user",
      "pssword": "123",
      "role": "admin"
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
//   describe('Negative test for creating a user with bad submitted data', function () {
//     let data = {
//       "userName": "test_user1",
//       "role": "admin"
//     }
//     it('should return 400 status', function () {
//       return request(app)
//         .post('/users')
//         .send(data)
//         // .set('Authorization', 'Bearer ' + token)
//         .then(function (response) {
//           assert.equal(response.status, 400)
//         })
//     })
//   })
})

// .post('/admin')
describe('Test to create a new admin', function () {
  describe('positive test for creating a admin', function () {
    let data = {
      "userName": "test_admin",
      "pssword": "123",
      "role": "admin"
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
  describe('Negative test for creating a admin that already eists', function () {
    let data = {
      "userName": "test_admin",
      "pssword": "123",
      "role": "admin"
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
				.get('/users/' + id)
				.then(function (response) {
					assert.equal(response.status, 200)
				})
		})
	})
  describe('Negative test to get a non-existant entry', function () {
		it('should return 404 status', function () {
			return request(app)
				.get('/users/' + 9292929)
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
		})
	})
  describe('Negative test to update a non-existant user', function () {
		let data = {
			"userName": "TEST_USER",
			"pssword": "321"
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