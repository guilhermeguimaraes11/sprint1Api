const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "10.89.240.78",
  user: "alunods",
  password: "ma@12345",
  database: "reserva_senai",
});

module.exports = pool;
