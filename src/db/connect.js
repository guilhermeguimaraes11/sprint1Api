const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "alunods",
  password: "senai@604",
  database: "resreva_senai",
});

module.exports = pool;
