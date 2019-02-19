import * as dbFunctions from "../db";

// options object:
//{
//  "action": "get"/"post"/"delete"/"put",
//  "table": "tablename",
//  "filter": [{field: "", operator: "", value: "", boolOp: ""}, ...],
//  "parameters": {"field": "value", ...},
//  "selectAll": true #set selectAll property to true to select all fields
//}

export let userInterface = (options, callback) => {
    let sqlString : string;
    let str: string = "";
    switch(options.action) {
        case "get":
            if (options.selectAll)
                str = "*";
            else {
                for (var k in options.parameters) {
                    str += `${k},`;
                }
                if (str.length > 0)
                    str = str.slice(0, -1);
            }
            sqlString = `SELECT ${str} FROM ${options.table}`;
            break;
        case "post":
            let keys: string = "";
            let vals: string = "";
            for (var k in options.parameters) {
                keys += `${k},`;
                vals += `'${options.parameters[k]}',`
            }
            if (keys.length > 0) keys = keys.slice(0, -1);
            if (vals.length > 0) vals = vals.slice(0, -1);
            sqlString = `INSERT INTO ${options.table} (${keys}) VALUES (${vals})`;
            break;
        case "delete":
            sqlString = `DELETE FROM ${options.table}`;
            break;
        case "put":
            for (var k in options.parameters) {
                str += `${k}='${options.parameters[k]}',`;
            }
            if (str.length > 0)
                str = str.slice(0, -1);
            sqlString = `INSERT INTO ${options.table} (${str})`;
            break;
    }
    if (options.filter && options.filter.length > 0) {
        let conditions : string = "";
        options.filter.forEach(el => {
            if (el.boolOp)
                conditions += ` ${el.boolOp} ${el.field} ${el.operator} ${el.value}`;
            else
                conditions += ` ${el.field} ${el.operator} ${el.value}`;
        });
        sqlString += ` WHERE${conditions}`;
    }
    console.log(sqlString); 
    dbFunctions.query(sqlString, (result, err) => {
        if (err) console.log(err);
        callback(err, result);
    })
}