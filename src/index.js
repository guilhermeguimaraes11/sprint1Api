const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const testConnect = require("./db/testConnect");

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    testConnect();
  }
  middlewares() {
    this.express.use(express.json());
    this.express.use(cors());
  }
  routes() {
    const apiRoutes = require("./routes/apiRoutes");
    this.express.use("/reservas/v1", apiRoutes);
  }
}

module.exports = new AppController().express;
