import * as dbFunctions from '../models/db'

// options object:
// {
//  'action': 'get'/'post'/'delete'/'put',
//  'table': 'tablename',
//  'filter': [{field: '', operator: '', value: '', boolOp: ''}, ...],
//  'parameters': {'field': 'value', ...},
//  'selectAll': true #set selectAll property to true to select all fields
// }

export let ftHandleGet = (options) => {
  let str: string = ''

  if (options.selectAll) {
    str = '*'
  } else {
    for (let k in options.parameters) {
      str += `${k},`
    }
    if (str.length > 0) {
      str = str.slice(0, -1)
    }
  }
  return(`SELECT ${str} FROM ${options.table}`)
}

export let ftHandlePost = (options) => {
  let keys: string = ''
  let vals: string = ''

  for (let k in options.parameters) {
    keys += `${k},`
    vals += `'${options.parameters[k]}',`
  }
  if (keys.length > 0) keys = keys.slice(0, -1)
  if (vals.length > 0) vals = vals.slice(0, -1)
  return(`INSERT INTO ${options.table} (${keys}) VALUES (${vals})`)
}

export let ftHandleDelete = (options) => {
  return(`DELETE FROM ${options.table}`)
}

export let ftHandlePut = (options) => {
  let str: string = ''
  for (let k in options.parameters) {
    str += `${k} = '${options.parameters[k]}',`
  }
  if (str.length > 0) {
    str = str.slice(0, -1)
  }
  return(`UPDATE ${options.table} SET ${str}`)
}

export let handleOp = (options, callback) => {
  let sqlString: string

  switch (options.action) {
    case 'get': sqlString = ftHandleGet(options)
      break
    case 'post': sqlString = ftHandlePost(options)
      break
    case 'delete': sqlString = ftHandleDelete(options)
      break
    case 'put': sqlString = ftHandlePut(options)
      break
  }
  if (options.filter && options.filter.length > 0) {
    let conditions: string = ''
    options.filter.forEach(el => {
      if (el.boolOp) {
        conditions += ` ${el.boolOp} ${el.field} ${el.operator} '${el.value}'`
      } else {
        conditions += ` ${el.field} ${el.operator} '${el.value}'`
      }
    })
    sqlString += ` WHERE${conditions}`
  }
  // console.log(sqlString)
  dbFunctions.query(sqlString, (err, result) => {
    if (err) {
      console.log(err)
    }
    callback(err, result)
  })
}
