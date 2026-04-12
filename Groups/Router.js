const express = require("express");

const Router = express.Router();
const groupControl = require("./Controllers")

Router.post("/create",groupControl.createGroup);
Router.post("/add",groupControl.addMembers);
Router.post("/groupList",groupControl.groupsList);
Router.post("/members",groupControl.groupbelongMemberList);
Router.post("/approve",groupControl.approveMember);
Router.post("/notify",groupControl.notifications);
Router.post("/readNotify",groupControl.markNotificationAsRead);

module.exports = Router;