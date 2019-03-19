var mysql = require('mysql');

var pool = mysql.createPool({
    host    : "localhost",
    user    : "root",
    password: "1503",
    port    : "3306",
    database: "dsu_db"
});

module.exports = pool;