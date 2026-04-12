const jwt = require("jsonwebtoken");
require('dotenv').config();

const accessKey = process.env.ACCESS
const refreshKey = process.env.REFRESH

const btExpiresIn = 2 * 60;        // 2 minutes (in seconds)
const rtExpiresIn = 10 * 60;        // 10 mintes (in Seconds)

const accessToken = (payload, key) => {
    const accessTkn= jwt.sign(payload, key, {
        expiresIn: btExpiresIn
    })
    return {
        token:accessTkn,
        expiresIn:btExpiresIn,
        expiresAt: Date.now() + btExpiresIn * 1000
    }
};

const refreshToken = (payload, key) => {
    const refresTkn = jwt.sign(payload, key, {
        expiresIn: rtExpiresIn
    })
    return{
        token:refresTkn,
        expiresIn:rtExpiresIn,
        expiresAt: Date.now() + rtExpiresIn * 1000
    }
};


const verifyJwt = (token, key) => {
    return jwt.verify(token, key)
}

const authMiddleWare = (req, res, next) => {
    const btTkn = req.headers['bt'];

    if (!btTkn) {
    return res.status(403).json({ message: "Please Contact Administrator" });
    }

    try {
        const decoded = verifyJwt(btTkn, accessKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};



const fakeUser = {
    "email": "prasad@email.com",
    "password": 123456
};

let refreshTokens = [];

const auth = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email !== fakeUser.email && password !== fakeUser.password) {
            res.json({
                status: false,
                statusCode: 1004,
                message: [{ code: "invalid", descrption: "Invalid Credintials" }]
            }).status(200)
        } else {
            const rt = refreshToken({ email }, refreshKey).token;
            const bt = accessToken({ email }, accessKey).token;
            refreshTokens.push(rt);
            res.json({
                status: true,
                statusCode: 1002,
                bt: bt,
                rt: rt,
                message: [{ descrption: "Login Successfully" }]
            }).status(200)
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Sever error" });
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
        const user = await verifyJwt(refreshTkn, refreshKey);
        const { email } = user;
        const bt = await accessToken({ email }, accessKey).token;
        res.setHeader("bt", String(bt));
        res.setHeader("bt-exp",btExpiresIn);

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

module.exports = { auth, generateRtToken ,accessToken ,refreshToken , verifyJwt,authMiddleWare , btExpiresIn , rtExpiresIn};