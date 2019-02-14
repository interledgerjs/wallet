import * as mysql from "mysql";

export let returnedRes: JSON;

let connectServer = (mysql.createConnection({
        host		: '127.0.0.1',
		user		: 'root',
        password	: 'password',
        insecureAuth : true
    }));

let connectDb = (mysql.createConnection({
        host		: '127.0.0.1',
        user		: 'root',
        password	: 'password',
        database    : 'my_db',
    }));

export let queryRet = (sqlQuery: string, callback) => {
    connectDb.query(sqlQuery, (err, result) => {
            if (err) throw err;
            callback(result);
        });
}

export let queryNoRet = (sqlQuery: string) => {
    connectDb.query(sqlQuery, (err) => {
        if (err) throw err;
    });
}

export let serverDB = (sqlQuery: string) => {
    connectServer.query(sqlQuery, (err) => {
        if (err) throw err;
    });
}