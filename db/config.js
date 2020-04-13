const mysql = require("mysql");
const util = require("util");

// make the connections
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employees_db"
});

// what to do with connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.clear();
});

connection.query = util.promisify(connection.query);




module.exports = connection;
