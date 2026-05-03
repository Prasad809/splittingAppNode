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

const getGroupTransactions = async (req, res) => {
    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({
                status: false,
                message: "groupId is required"
            });
        }

        // 🔹 Get transactions
        const [transactions] = await db.query(
            `SELECT 
                e.id,
                e.groupId,
                g.groupName,
                e.paidBy,
                u.name AS userName,
                e.description,
                e.amount,
                e.createdAt
             FROM expenses e
             JOIN memberGroup g ON g.id = e.groupId
             JOIN users u ON u.id = e.paidBy
             WHERE e.groupId = ?
             ORDER BY e.createdAt DESC`,
            [groupId]
        );

        // 🔹 Get total
        const [totalResult] = await db.query(
            `SELECT SUM(amount) AS totalAmount FROM expenses WHERE groupId = ?`,
            [groupId]
        );

        const totalAmount = totalResult[0].totalAmount || 0;

        return res.status(200).json({
            status: true,
            data: {
                groupId,
                totalAmount,
                transactions
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};

const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "userId is required"
            });
        }

        // 🔹 1. Paid by user
        const [paid] = await db.query(`
            SELECT 
                e.id AS expenseId,
                e.groupId,
                g.groupName,
                e.description,
                e.amount,
                e.createdAt,
                'PAID' AS type
            FROM expenses e
            JOIN memberGroup g ON g.id = e.groupId
            WHERE e.paidBy = ?
        `, [userId]);

        // 🔹 2. User owes (from all groups)
        const [owed] = await db.query(`
            SELECT 
                e.id AS expenseId,
                e.groupId,
                e.description,
                g.groupName,
                es.amount,
                e.createdAt,
                'OWE' AS type
            FROM expenseSplit es
            JOIN expenses e ON e.id = es.expenseId
            JOIN memberGroup g ON g.id = e.groupId
            WHERE es.userId = ?
        `, [userId]);

        // 🔹 merge + sort
        const data = [...paid, ...owed].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return res.json({
            status: true,
            data
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false });
    }
};

const getExpenseSummary = async (req, res) => {
    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({
                status: false,
                message: "groupId is required"
            });
        }

        // 1️⃣ Get all expenses
        const [expenses] = await db.query(
            `SELECT id, paidBy, amount 
             FROM expenses 
             WHERE groupId = ?`,
            [groupId]
        );

        // 2️⃣ Get all members of group
        const [members] = await db.query(
            `SELECT userId, u.name 
             FROM groupMembers gm
             JOIN users u ON u.id = gm.userId
             WHERE gm.groupId = ?`,
            [groupId]
        );

        // 3️⃣ Total amount
        const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

        const memberCount = members.length || 1;
        const sharePerPerson = totalAmount / memberCount;

        // 4️⃣ Calculate how much each user paid
        const paidMap = {};

        expenses.forEach(exp => {
            if (!paidMap[exp.paidBy]) {
                paidMap[exp.paidBy] = 0;
            }
            paidMap[exp.paidBy] += Number(exp.amount);
        });

        // 5️⃣ Build balance sheet
        const balances = members
            .map(member => {
                const paid = paidMap[member.userId] || 0;
                const balance = paid - sharePerPerson;

                return {
                    userId: member.userId,
                    name: member.name,
                    paid,
                    share: sharePerPerson,
                    balance
                };
            })
            .filter(
                (item, index, arr) =>
                    arr.findIndex(x => x.userId === item.userId) === index
            );
        return res.status(200).json({
            status: true,
            data: {
                groupId,
                totalAmount,
                sharePerPerson,
                balances
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};


module.exports = { paidAmount,userList,getGroupTransactions,getUserTransactions,getExpenseSummary };