const express = require("express");

const Router = express.Router();
const spliteControl = require("./Controllers")

Router.post("/addAmt",spliteControl.paidAmount);
Router.get("/users",spliteControl.userList);

module.exports = Router;