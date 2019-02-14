"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
//get /initialise builds database and tables
exports.getRates = function (req, res) {
    axios_1["default"].get('http://data.fixer.io/api/latest?access_key=076319f31a8427aa91d08a789026f192').then(function (response) {
        console.log(response.data);
        res.send(response.data);
    })["catch"](function (error) {
        console.log(error);
        res.sendStatus(500);
    });
};
