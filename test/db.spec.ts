import * as assert from "assert";
import * as db from '../build/db'

describe('MySQL query', function () {

  it('(Standard query) should callback a null error value', function(done) {
    process.env.ACTIVEDB = "MySQL"
    process.env.DBNAME = "my_db"
    process.env.DBPASSWORD = "password"
    process.env.DBHOST = "localhost"
    process.env.DBUSER = "root"
    db.query("SELECT * FROM users", (err, result) => {
      assert.equal(null, err)
      done()
    })
  })
  // error checking tests
  it('(bad sql) should callback a non null error value', function(done) {
    db.query("bad sql", (err, result) => {
      assert.notEqual(null, err)
      done()
    })
  })
  it('(bad connection input) should callback a non null error value if using MySQL', function(done) {
    process.env.DBHOST = 'badHost'
    db.query("SELECT * FROM users", (err, result) => {
      if (process.env.ACTIVEDB === 'MySQL') {
        assert.notEqual(null, err)
      }
      else {
        assert.equal(null, err)
      }
      done()
    })
  })
})

describe('SQLite query', function () {
  // positive tests
  it('(Standard query) should callback a null error value', function(done) {
    process.env.ACTIVEDB = "SQLite"
    process.env.DBNAME = "my_db"
    process.env.DBPASSWORD = "password"
    process.env.DBHOST = "localhost"
    process.env.DBUSER = "root"

    db.query("SELECT * FROM users", (err, result) => {
      assert.equal(null, err)
      done()
    })
  })
  // error checking tests
  it('(bad sql) should callback a non null error value', function(done) {
    db.query("bad sql", (err, result) => {
      assert.notEqual(null, err)
      done()
    })
  })
})
