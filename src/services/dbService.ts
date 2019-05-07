import * as sqlite3 from 'sqlite3'
require('dotenv').config()
import * as knex from '../../database/knex'

export function query (sqlQuery: string): Promise<object[]> {
  return new Promise(function (resolve, reject) {
    if (process.env.DBNAME && process.env.DBNAME !== '') {
      const db = new sqlite3.Database(`${process.env.DBFOLDER}${process.env.DBNAME}`)
      db.all(sqlQuery, function (err: Error, data: object[]) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    } else {
      reject('No database')
    }
  })
}

export function knexSelectByUserName (userName: string, targetTable: string) {
  return knex.select()
          .from(targetTable)
          .where('userName', userName)
          .then(function (result: []) {
            result = JSON.parse(JSON.stringify(result))
            return result
          })
}

export function knexInsert (body, targetTable) {
  return knex(targetTable)
    .insert(body)
    .then(function (result) {
      return knexSelectById(result[0], targetTable)
    })
}

export function knexSelectAll (targetTable: string) {
  return knex.select()
          .from(targetTable)
          .then(function (result) {
            result = JSON.parse(JSON.stringify(result))
            return result
          })
}

export function knexSelectById (id: number, targetTable: string) {
  return knex.select()
          .from(targetTable)
          .where('id', id)
          .then(function (result) {
            result = JSON.parse(JSON.stringify(result))
            return result
          })
}

export function knexUpdateById (body, id, targetTable) {
  return knex(targetTable)
    .where('id', id)
    .update(body)
    .then(function () {
      return knexSelectById(id, 'users')
    })
}

export function knexSelectByOwner (owner, targetTable) {
  return knex.select()
   .from(targetTable)
    .where('owner', owner)
    .then(function (result) {
      result = JSON.parse(JSON.stringify(result))
      return result
    })
}

export function knexSelectTransactionByEitherAccount (id, targetTable) {
  return knex.select()
          .from(targetTable)
          .where('debitAccountId', id)
          .orWhere('creditAccountId', id)
          .then(function (result) {
            result = JSON.parse(JSON.stringify(result))
            return result
          })
}
