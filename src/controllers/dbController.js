"use strict";
exports.__esModule = true;
var dbFunctions = require("../db");
//get /initialise builds database and tables
exports.initialise = function (req, res) {
    var createdb = function (buildTables) {
        dbFunctions.serverDB("CREATE DATABASE IF NOT EXISTS my_db");
        buildTables();
    };
    createdb(function () {
        dbFunctions.queryNoRet("CREATE TABLE IF NOT EXISTS wallets (\
                                    walletid INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
                                    balance LONG,\
                                    holder VARCHAR(255) NOT NULL\
                                )");
        dbFunctions.queryNoRet("CREATE TABLE IF NOT EXISTS transactions (\
                                    transactionid INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
                                    value LONG,\
                                    sourceid INT,\
                                    destid INT\
                                )");
    });
    res.send("Database built");
};
//get /drop
exports.drop = function (req, res) {
    dbFunctions.serverDB("DROP DATABASE IF EXISTS my_db");
    res.send("Database dropped");
};
