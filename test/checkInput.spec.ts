import * as assert from "assert";
import * as checkInput from '../build/checkInput'

describe('valTrans', function () {
  // positive tests
  it('should callback a null value', function(done) {
    let req = {
      method: 'anything',
      body: {
        amount: 1
      }
    }
    checkInput.valTrans(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  it('(POST) should callback a null value', function(done) {
    let req = {
      method: 'POST',
      body: {
        dbtAccID: 1,
        crdtAccID: 1,
        amount: 1
      }
    }
    checkInput.valTrans(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  it('(PUT) should callback a null value', function(done) {
    let req = {
      method: 'PUT',
      body: {
        dbtAccID: 1,
        crdtAccID: 1,
        amount: 1
      }
    }
    checkInput.valTrans(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  // negative tests
  it('(POST) should callback a non null value', function(done) {
    let req = {
      method: 'POST',
      body: {
        dbtAccID: 1,
        crdtAccID: 1
      }
    }
    checkInput.valTrans(req, function(err) {
      assert.notEqual(null, err)
      done()
    })
  })
  it('(put) should callback a non null value', function(done) {
    let req = {
      method: 'PUT',
      body: {
        dbtAccID: 1,
        crdtAccID: "NAN"
      }
    }
    checkInput.valTrans(req, function(err) {
      assert.notEqual(null, err)
      done()
    })
  })
})

describe('valUser', function () {
  // positive tests
  it('should callback a null value', function(done) {
    let req = {
      method: 'anything',
      body: {
        amount: 1
      }
    }
    checkInput.valUser(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  it('(POST) should callback a null value', function(done) {
    let req = {
      method: 'POST',
      body: {
        userName: 'name',
        active: 1,
        password: 'password'
      }
    }
    checkInput.valUser(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  it('(PUT) should callback a null value', function(done) {
    let req = {
      method: 'PUT',
      body: {
        password: 'password'
      }
    }
    checkInput.valUser(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  // negative tests
  it('(POST) should callback a non null value', function(done) {
    let req = {
      method: 'POST',
      body: {
        dbtAccID: 1,
        crdtAccID: 1
      }
    }
    checkInput.valUser(req, function(err) {
      assert.notEqual(null, err)
      done()
    })
  })
  it('(put) should callback a non null value', function(done) {
    let req = {
      method: 'PUT',
      body: {
        dbtAccID: 1,
        crdtAccID: "NAN"
      }
    }
    checkInput.valUser(req, function(err) {
      assert.notEqual(null, err)
      done()
    })
  })
})

describe('valAcc', function () {
  // positive tests
  it('should callback a null value', function(done) {
    let req = {
      method: 'anything',
      body: {
        amount: 1
      }
    }
    checkInput.valAcc(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  it('(POST) should callback a null value', function(done) {
    let req = {
      method: 'POST',
      body: {
        accountName: 'accName',
        ownerUserID: 1
      }
    }
    checkInput.valAcc(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  it('(PUT) should callback a null value', function(done) {
    let req = {
      method: 'PUT',
      body: {
        accountName: 'accName',
        ownerUserID: 1
      }
    }
    checkInput.valAcc(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  // negative tests
  it('(POST) should callback a non null value', function(done) {
    let req = {
      method: 'POST',
      body: {
        dbtAccID: 1,
        crdtAccID: 1
      }
    }
    checkInput.valAcc(req, function(err) {
      assert.notEqual(null, err)
      done()
    })
  })
  it('(put) should callback a non null value', function(done) {
    let req = {
      method: 'PUT',
      body: {
      }
    }
    checkInput.valAcc(req, function(err) {
      assert.notEqual(null, err)
      done()
    })
  })
})

describe('valLogin', function () {
  // positive tests
  it('should callback a null value', function(done) {
    let req = {
      method: 'anything'
    }
    checkInput.valLogin(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  it('(GET) should callback a null value', function(done) {
    let req = {
      method: 'GET',
      body: {
        password: 'password'
      },
      params: {
        username: 'name'
      }
    }
    checkInput.valLogin(req, function(err) {
      assert.equal(null, err)
      done()
    })
  })
  // negative tests
  it('(GET) should callback a non null value', function(done) {
    let req = {
      method: 'GET',
      body: {
      }
    }
    checkInput.valLogin(req, function(err) {
      assert.notEqual(null, err)
      done()
    })
  })
  it('(GET) should callback a non null value', function(done) {
    let req = {
      method: 'GET',
      body: {
        password: 'password'
      },
      params: {
      }
    }
    checkInput.valLogin(req, function(err) {
      assert.notEqual(null, err)
      done()
    })
  })
})
