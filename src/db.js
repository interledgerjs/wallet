"use strict";
exports.__esModule = true;
var mysql = require("mysql");
var connectServer = (mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    insecureAuth: true
}));
var connectDb = (mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'my_db'
}));
exports.queryRet = function (sqlQuery, callback) {
    connectDb.query(sqlQuery, function (err, result) {
        if (err)
            throw err;
        callback(result);
    });
};
exports.queryNoRet = function (sqlQuery) {
    connectDb.query(sqlQuery, function (err) {
        if (err)
            throw err;
    });
};
exports.serverDB = function (sqlQuery) {
    connectServer.query(sqlQuery, function (err) {
        if (err)
            throw err;
    });
};
