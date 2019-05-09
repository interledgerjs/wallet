import { assert } from 'chai'
import * as request from 'supertest'
import * as app from '../../../build/app'
import * as expect from 'expect'
import * as dotenv from 'dotenv'
import * as knex from '../../../database/knex'

dotenv.config()
let adminName = 'admin'
let adminPassword = 'admin'
if (process.env.ADMINNAME) {
  adminName = process.env.ADMINNAME
}
if (process.env.ADMINPASSWORD) {
  adminPassword = process.env.ADMINPASSWORD
}

let adminToken
before(function () {
  return request(app)
    .post('/token')
    .send({
      'userName': adminName,
      'pssword': adminPassword
    })
    .then(function (response) {
      adminToken = response.body.token
    })
})

after(function () {
  knex.destroy()
})

describe('.post/admin', function () {
  it('should return HTTP 200 when called with good data', function () {
    let data = {
      'userName': 'test_admin',
      'pssword': '123',
      'role': 'admin'
    }

    return request(app)
      .post('/admin')
      .send(data)
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 400 when userName matches an existing user', function () {
    let data = {
      'userName': 'test_admin',
      'pssword': '123',
      'role': 'admin'
    }
    return request(app)
      .post('/admin')
      .send(data)
      .set('Authorization', 'Bearer ' + adminToken)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })
})

// describe('.post/token', function () {
//   let validUser = {
//     'userName': 'TokenUser',
//     'pssword': 'mypassword',
//     'id': ''
//   }

//   let invalidUser = {
//     'userName': 'NotTokenUser',
//     'pssword': 'mypassword',
//     'id': ''
//   }

//   before(function () {
//     return request(app)
//       .post('/users')
//       .send(validUser)
//       .then(function () {
//         return request(app)
//           .get('/users')
//           .set('Authorization', 'Bearer ' + adminToken)
//           .then(function (response) {
//             response.body.forEach(element => {
//               if (element.userName === validUser.userName) {
//                 validUser.id = element.id
//               }
//             })
//           })
//       })
//   })

//   it('should return a token when passed valid credentials', function () {
//     return request(app)
//       .post('/token') // knex pending
//       .send(validUser)
//     .then(function (response) {
//       assert.equal(response.body.token.length, 204)
//       expect(response.body.token).not.toMatch('/ /')
//     })
//   })

//   it('should return HTTP 404 when passed non-existent credentials', function () {
//     return request(app)
//       .post('/token')
//       .send(invalidUser)
//     .then(function (response) {
//       assert.equal(response.status, 404)
//     })
//   })

//   after(function () {
//     return request(app)
//       .delete('/users/' + validUser.id)
//   })
// })

describe('.post/users', function () {
  let data = {
    'userName': 'test_user',
    'pssword': '123',
    'role': 'admin'
  }

  let badData = {
    'userName': 'test_user1',
    'role': 'admin'
  }

  it('should return HTTP 200 when called with good data', function () {
    return request(app)
      .post('/users')
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  // it('should return HTTP 400 when called with bad data', function () { // test temporarily omitted due to absence of proto object checking
  //   return request(app)
  //     .post('/users')
  //     .send(badData)
  //     // .set('Authorization', 'Bearer ' + token)
  //     .then(function (response) {
  //       assert.equal(response.status, 400)
  //     })
  // })

  it('should return HTTP 400 when userName matches an existing user', function () {
    return request(app)
      .post('/users')
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })
})

describe('.get/users', function () {
  let dbname = process.env.DBNAME
  let id
  let userName

  before(function () {
    return request(app)
      .get('/users')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        id = response.body[0].id
        userName = response.body[0].userName
      })
  })

  afterEach(function () {
    process.env.DBNAME = dbname
  })

  it('should return HTTP 200 when db table contains data', function () {
    return request(app)
      .get('/users')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  // it('should return HTTP 400 when db table is empty', function () { // test suspended; now empty table under mysql
  //   process.env.DBNAME = 'emptydb'
  //   return request(app)
  //     .get('/users')
  //     .set('Authorization', 'Bearer ' + adminToken)
  //     .then(function (response) {
  //       assert.equal(response.status, 404)
  //     })
  // })

  // it('should return HTTP 500 when db cannot be found', function () { // test suspended; changing target db during test not yet implemented
  //   process.env.DBNAME = ''
  //   return request(app)
  //     .get('/users')
  //     .set('Authorization', 'Bearer ' + adminToken)
  //     .then(function (response) {
  //       assert.equal(response.status, 500)
  //     })
  // })

  it('should return HTTP 200 when querying by a valid id', function () {
    return request(app)
      .get('/users/' + id)
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 404 when querying by a non-existent id', function () {
    return request(app)
  		.get('/users/' + 9292929)
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })

  // it('should return HTTP 500 when db cannot be found', function () { // test suspended; changing knextarget db during test not yet implemented
  //   process.env.DBNAME = ''
  //   return request(app)
  //     .get('/users/' + id)
  //     .set('Authorization', 'Bearer ' + adminToken)
  //     .then(function (response) {
  //       assert.equal(response.status, 500)
  //     })
  // })

  // it('should return HTTP 404 when querying by a non-existing userName', function () { // test suspended; route currently not supported
  //   return request(app)
  //     .get('/users?username=' + 'jhfgsxhjb')
  //     .then(function (response) {
  //       assert.equal(response.status, 404)
  //     })
  // })
})

describe('.put/users', function () {
  let id: number
  let data = {
    'userName': 'TEST_USER',
    'pssword': '321'
  }

  before(function () {
    return request(app)
      .get('/users')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        id = response.body[1].id
      })
  })

  it('should return HTTP 200 when querying with good data', function () {
    return request(app)
      .put('/users/' + id)
      .set('Authorization', 'Bearer ' + adminToken)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 400 when called with bad data', function () {
    let data = {
      'userName': 1,
      'pssword': '321'
    }
    return request(app)
      .put('/users/' + id)
      .set('Authorization', 'Bearer ' + adminToken)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 400)
      })
  })

  it('should return HTTP 404 when querying with a non-existent id', function () {
    return request(app)
      .put('/users/' + 7851365)
      .set('Authorization', 'Bearer ' + adminToken)
      .send(data)
      // .set('Authorization', 'Bearer ' + token)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})

describe('.delete/users', function () {
  let id

  before(function () {
    return request(app)
      .get('/users')
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        id = response.body[1].id
      })
  })

  it('should return HTTP 200 when called with a valid id', function () {
    return request(app)
      .delete('/users/' + id)
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 200)
      })
  })

  it('should return HTTP 404 when called with a non-existent id', function () {
    return request(app)
      .delete('/users/' + 898989898)
      .set('Authorization', 'Bearer ' + adminToken)
      .then(function (response) {
        assert.equal(response.status, 404)
      })
  })
})

//  // describe('Negative test for creating a admin with bad submitted data', function () {
//  //   let data = {
//  //     "userName": "test_admin1",
//  //     "role": "admin"
//  //   }
//  //   it//('should return 400 status', function () {
//  //     return request(app)
//  //       .post('/admin')
//  //       .send(data)
//  //       // .set('Authorization', 'Bearer ' + token)
//  //       .then(function (response) {
//  //         assert.equal(response.status, 400)
//  //       })
//  //   })
//  // })
