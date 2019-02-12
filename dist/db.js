"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
let connectServer = (mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
}));
let connectDb = (mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_db'
}));
exports.queryRet = (sqlQuery, callback) => {
    connectDb.query(sqlQuery, (err, result) => {
        if (err)
            throw err;
        callback(result);
    });
};
exports.queryNoRet = (sqlQuery) => {
    connectDb.query(sqlQuery, (err) => {
        if (err)
            throw err;
    });
};
exports.serverDB = (sqlQuery) => {
    connectServer.query(sqlQuery, (err) => {
        if (err)
            throw err;
    });
};
