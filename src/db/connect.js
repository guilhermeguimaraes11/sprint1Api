const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
<<<<<<< HEAD
  host: "10.89.240.70",
=======
  host: "localhost",
>>>>>>> f75424c9dd4c49aecba8ccd6429b1b2d25957239
  user: "alunods",
  password: "senai@604",
  database: "reserva_senai",
});

module.exports = pool;
