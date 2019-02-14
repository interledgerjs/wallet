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
exports.query = (sqlQuery, callback) => {
    connectDb.query(sqlQuery, (err, result) => {
        if (err)
            console.log(err);
        callback(err, result);
    });
};
exports.serverDB = (sqlQuery, callback) => {
    connectServer.query(sqlQuery, (err) => {
        if (err)
            throw err;
        callback(err);
    });
};
exports.initialise = () => {
    exports.serverDB("CREATE DATABASE IF NOT EXISTS my_db", (err) => {
        if (!err) {
            exports.query("CREATE TABLE IF NOT EXISTS users (\
                user_id INTEGER PRIMARY KEY AUTO_INCREMENT,\
                first_name TEXT, \
                last_name TEXT, \
                email TEXT, \
                password TEXT);", (err) => {
                if (err)
                    throw err;
            });
            exports.query("CREATE TABLE IF NOT EXISTS accounts (\
                account_id INTEGER PRIMARY KEY AUTO_INCREMENT, \
                account_type INTEGER, account_number INTEGER, \
                account_balance INTEGER, scale REAL);", (err) => {
                if (err)
                    throw err;
            });
            exports.query("CREATE TABLE IF NOT EXISTS transactions (\
                transaction_id INTEGER PRIMARY KEY AUTO_INCREMENT, \
                account_id INTEGER, \
                transaction_date TEXT, \
                credit INTEGER, \
                debit INTEGER, \
                scale REAL, \
                FOREIGN KEY(account_id) REFERENCES accounts(account_id));", (err) => {
                if (err)
                    throw err;
            });
            exports.query("CREATE TABLE IF NOT EXISTS account_owner (\
                user_id INTEGER, \
                account_id INTEGER, \
                FOREIGN KEY (user_id) REFERENCES users(user_id), \
                FOREIGN KEY(account_id) REFERENCES accounts(account_id));", (err) => {
                if (err)
                    throw err;
            });
        }
    });
};
