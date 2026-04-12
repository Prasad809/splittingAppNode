require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./Users/Router");
const userControlTokns = require("./Users/Controllers");
const groupRouter = require("./Groups/Router");
const splitRouter = require("./Splites/Router");
const auth = require("./AuthJwt/Auth");
const cmgpd = require("./AuthJwt/serverCmgpd");

const PORT = process.env.PORT || 8082;


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    exposedHeaders: ["rt", "bt","bt-exp","rt-exp"]
}));



app.use("/user",userRouter);
app.use("/group",auth.authMiddleWare,groupRouter);
app.use("/split",auth.authMiddleWare,splitRouter);

app.use('/login',auth.auth);
app.use('/tokens',userControlTokns.generateRtToken);
app.use('/cmgpd',cmgpd);
app.use('/',(req,res)=>{
    res.send("<h1>Hello World</h1>")
});

app.listen(PORT,(err)=>{
    console.log("Server Running At ",PORT)
});
