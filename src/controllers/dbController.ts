import { Request, Response } from "express";
import * as dbFunctions from "../db";

//get /initialise builds database and tables
export let initialise = (req: Request, res: Response) => {

    

    let createdb = (buildTables) => {
        dbFunctions.serverDB("CREATE DATABASE IF NOT EXISTS my_db");
        buildTables();
    }

    createdb(() => {
        dbFunctions.queryNoRet("CREATE TABLE IF NOT EXISTS wallets (\
                                    walletid INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
                                    balance LONG,\
                                    holder VARCHAR(255) NOT NULL\
                                )"
        )
        dbFunctions.queryNoRet("CREATE TABLE IF NOT EXISTS transactions (\
                                    transactionid INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
                                    value LONG,\
                                    sourceid INT,\
                                    destid INT\
                                )"
        )
    });

    res.send("Database built");
}

//get /drop
export let drop = (req: Request, res: Response) => {
    dbFunctions.serverDB("DROP DATABASE IF EXISTS my_db");

    res.send("Database dropped");
}