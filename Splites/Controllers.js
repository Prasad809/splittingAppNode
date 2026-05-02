const db = require("../dbConnection");


const paidAmount = async (req, res) => {
    try {
        const { groupId, paidBy, amount, description } = req.body;

        if (!groupId || !paidBy || !amount || !description) {
            return res.status(400).json({
                status: false,
                message: [{ description: "Something went wrong Bad request" }]
            });
        }

        await db.query(
            "INSERT INTO expenses (groupId,paidBy,amount,description,createdAt) VALUES (?,?,?,?,?)",
        [groupId, paidBy, amount,description, new Date()]);

        return res.status(200).json({
            status: true,
            message: [{ description: "Paid Amount is added successfully" }]
        });

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            status: false,
            message: [{ description: "Internal Server Problem" }]
        });
    }
};
const userList = async (req, res) => {
    try {
        let query = "SELECT * FROM users ";
        const [users] = await db.query(query);
    

        return res.status(200).json({
            status: true,
            message: [{ description: "user Details Retrieved successfully" }],
            users:users.map(({ id, name, email, phone }) => ({id,name,email,phone}))
        });

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            status: false,
            message: [{ description: "Internal Server Problem" }]
        });
    }
};





module.exports = { paidAmount,userList};