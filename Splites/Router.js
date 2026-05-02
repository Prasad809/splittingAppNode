const express = require("express");

const Router = express.Router();
const spliteControl = require("./Controllers")

Router.post("/addAmt",spliteControl.paidAmount);
Router.post("/viewTrans",spliteControl.getGroupTransactions);
Router.post("/userSummy",spliteControl.getUserTransactions);
Router.get("/users",spliteControl.userList);

module.exports = Router;