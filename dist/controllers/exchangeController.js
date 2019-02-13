"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
//get /initialise builds database and tables
exports.getRates = (req, res) => {
    axios_1.default.get('http://data.fixer.io/api/latest?access_key=076319f31a8427aa91d08a789026f192').then((response) => {
        console.log(response.data);
        res.send(response.data);
    })
        .catch(error => {
        console.log(error);
        res.sendStatus(500);
    });
};
