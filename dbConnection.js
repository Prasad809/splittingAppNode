const mysql = require('mysql2/promise');
require('dotenv').config();

const createPool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

module.exports = createPool;