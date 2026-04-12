const db = require("../dbConnection");
const bcrypt = require('bcryptjs');
const tokens = require("../AuthJwt/Auth");
require('dotenv').config();

const accessKey = process.env.ACCESS
const refreshKey = process.env.REFRESH
let refreshTokens = [];


const signUp = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.json({ status: false, message: [{ description: "Something went wrong,Bad Request" }] }).status(400);
        }
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ? OR phone = ?",
            [email, phone]
        );

        if (users.length > 0) {
            return res.status(200).json({ status: false, message: [{ description: "User already exists, try with another email or phone" }] });
        } else {
            // const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                "INSERT INTO users (name,email,phone,password,isActive) VALUES (?,?,?,?,?)",
                [name, email, phone, password, "Y"]);
                // [name, email, phone, hashedPassword, "Y"]);
            return res.json({ status: true, message: [{ description: "User Register Successfully." }] }).status(200);
        }
    } catch (error) {
        return res.json({ status: false, message: [{ description: "Internal Server Problem" }] }).status(500);
    }
};


const signIn = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        
        if ((!email && !phone) || !password) {
            return res.status(400).json({
                status: false,
                message: [{ description: "Email or phone and password are required" }]
            });
        }

        let query = "SELECT * FROM users WHERE ";
        const params = [];

        if (email) {
            query += "email = ?";
            params.push(email);
        } else if (phone) {
            query += "phone = ?";
            params.push(phone);
        }

        const [users] = await db.query(query, params);
        
        const user = users[0];

        if (!user) {
            return res.status(200).json({
                status: false,
                message: [{ description: "User does not exist with these credentials" }]
            });
        }
        
            if (password !== user.password) {
                return res.status(200).json({ status: false, message: [{ description: "Invalid credentials" }] });
            }else{
            const rt = tokens.refreshToken({ email }, refreshKey);
            const bt = tokens.accessToken({ email }, accessKey);
            res.setHeader("bt", String(bt.token));
            res.setHeader("rt", String(rt.token));
            res.setHeader("bt-exp", bt.expiresAt);
            res.setHeader("rt-exp", rt.expiresAt);
            refreshTokens.push(rt.token);
            return res.status(200).json({
                status: true,
                message: [{ description: "User login successfully" }],
                userRefNum:user?.id
            });
        }

    } catch (error) {
        console.log(error);

        return res.json({ status: false, message: [{ description: "Internal Server Problem" }] }).status(500);
    }
};

const generateRtToken = async (req, res) => {
    const refreshTkn = req.headers['rt'];
    if (!refreshTkn) {
        return res.json({ message: [{ descrption: "Token Not found" }] }).status(401);
    }
    if (!refreshTokens.includes(refreshTkn)) {
        return res.json({ message: [{ descrption: "Invalid Token" }] }).status(403);
    }
    try {
        const user = await tokens.verifyJwt(refreshTkn, refreshKey);
        const { email } = user;
        const bt = await tokens.accessToken({ email }, accessKey);
        res.setHeader("bt", String(bt.token));
        res.setHeader("bt-exp",bt.expiresAt);

        return res.json({ message: "Bear token Created" ,status:true}).status(200)
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                message: "Refresh token expired. Please login again."
            });
        }
        return res.json({ message: [{ descrption: "Internal Sever Problem" }] }).status(500);
    }
};


module.exports = { signUp, signIn, generateRtToken };