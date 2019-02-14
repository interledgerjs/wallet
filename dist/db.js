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
    console.log('db building');
    exports.serverDB("CREATE DATABASE IF NOT EXISTS my_db", (err) => {
        if (!err) {
            exports.query("CREATE TABLE IF NOT EXISTS users (\
                user_id INT AUTO_INCREMENT PRIMARY KEY,\
                user_name VARCHAR(255),\
                date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
                active INT);", (err) => {
                if (err)
                    throw err;
            });
            exports.query("CREATE TABLE IF NOT EXISTS accounts (\
                account_id INT AUTO_INCREMENT PRIMARY KEY,\
                account_name VARCHAR(255),\
                owner_user_id INT,\
                balance INT,\
                last_updated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);", (err) => {
                if (err)
                    throw err;
            });
            exports.query("CREATE TABLE IF NOT EXISTS transactions (\
                trans_id INT AUTO_INCREMENT PRIMARY KEY,\
                dbt_acc_id INT,\
                crdt_acc_id INT,\
                amount INT,\
                date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);", (err) => {
                if (err)
                    throw err;
            });
        }
    });
};
