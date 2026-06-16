const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host:     process.env.MYSQL_HOST,
    port:     parseInt(process.env.MYSQL_PORT),
    user:     process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset:  "utf8mb4",
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;
