const db = require("../dbConnection");

const createGroup = async (req, res) => {
    try {
        const { groupName, description, createdBy } = req.body;
        if (!groupName || !description || !createdBy) {
            return res.json({ status: false, message: [{ description: "Something went wrong,Bad Request" }] }).status(400);
        }
        const [result] = await db.query(
            "INSERT INTO memberGroup (groupName,description,createdBy,createdAt,isActive) VALUES (?,?,?,?,?)",
            [groupName, description, createdBy, new Date(), "Y"]);
        const groupId = result.insertId;
        await db.query(
            "INSERT INTO groupMembers (groupId, userId, status, joinedAt) VALUES (?,?,?,?)",
            [groupId, createdBy, "APPROVED", new Date()]
        );
        return res.json({ status: true, message: [{ description: "Group Created Successfully." }] }).status(200);
    } catch (error) {
        return res.json({ status: false, message: [{ description: "Internal Server Problem" }] }).status(500);
    }
};

const addMembers = async (req, res) => {
    try {
        const { groupId, userId, addedBy } = req.body;

        if (!groupId || !userId || !addedBy) {
            return res.status(400).json({
                status: false,
                message: [{ description: "Something went wrong, Bad Request" }]
            });
        }

        // 🔍 Check if already exists
        const [existing] = await db.query(
            "SELECT id FROM groupMembers WHERE groupId = ? AND userId = ?",
            [groupId, userId]
        );

        if (existing.length > 0) {
            return res.status(200).json({
                status: false,
                message: [{ description: "User already exists in this group" }]
            });
        }

        // ✅ Insert if not exists
        await db.query(
            "INSERT INTO groupMembers (groupId, userId, status, joinedAt) VALUES (?,?,?,?)",
            [groupId, userId, "PENDING", new Date()]
        );

        const [group] = await db.query(
            "SELECT groupName FROM memberGroup WHERE id = ?",
            [groupId]
        );

        const [user] = await db.query(
            "SELECT name FROM users WHERE id = ?",
            [addedBy]
        );

        const groupName = group.length ? group[0].groupName : "Unknown Group";
        const userName = user.length ? user[0].name : "Unknown Person";

        const message = `You Invited to Group (${groupName}) by Your friend ${userName}.`;

        await db.query(
            "INSERT INTO notifications (userId, message, groupId, referenceId, isRead, createdAt) VALUES (?,?,?,?,?,?)",
            [userId, message, groupId, addedBy, "N", new Date()]
        );

        return res.status(200).json({
            status: true,
            message: [{ description: "Sent Request Successfully." }]
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: [{ description: "Internal Server Problem" }]
        });
    }
};

const groupsList = async (req, res) => {
    try {
        const { userId } = req.body;
         const [groups] = await db.query(`
            SELECT mg.id AS groupId, mg.groupName, mg.description
            FROM memberGroup mg
            JOIN groupMembers gm ON mg.id = gm.groupId
            WHERE gm.userId = ?
        `, [userId]);
        const uniqueGroups = [...new Map(groups.map(item => [item.groupId, item])).values()];
        return res.status(200).json({
            status: true,
            totalGroups: groups.length,
            groups:uniqueGroups
        });
    } catch (error) {        
        return res.json({ status: false, message: [{ description: "Internal Server Problem" }] }).status(500);
    }
};

const groupbelongMemberList = async (req, res) => {
    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({
                status: false,
                message: [{ description: "Group ID is required" }]
            });
        }

        const [members] = await db.query(`
            SELECT u.id AS userId, u.name, u.email, u.phone, gm.joinedAt
            FROM groupMembers gm
            JOIN users u ON gm.userId = u.id
            WHERE gm.groupId = ? AND gm.status = 'APPROVED'
            ORDER BY gm.joinedAt
        `, [groupId]);

        return res.status(200).json({
            status: true,
            totalMembers: members.length,
            members
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: [{ description: "Internal Server Problem" }]
        });
    }
};

const approveMember = async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        if (!groupId || !userId) {
            return res.status(400).json({
                status: false,
                message: [{ description: "Group ID and User ID are required" }]
            });
        }

        const [result] = await db.query(`
            UPDATE groupMembers 
            SET status = 'APPROVED'
            WHERE groupId = ? AND userId = ? AND status = 'PENDING'
        `, [groupId, userId]);

        if (result.affectedRows === 0) {
            return res.status(200).json({
                status: false,
                message: [{ description: "No pending request found for this user in this group" }]
            });
        }

        return res.status(200).json({
            status: true,
            message: [{ description: "Member approved successfully" }]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: [{ description: "Internal Server Problem" }]
        });
    }
};

const notifications = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: [{ description: "something went wrong.bad request" }]
            });
        }

        const [result] = await db.query(`
            SELECT * FROM notifications
            WHERE userId = ?
        `, [userId]);

        if (result.length > 0) {
            return res.status(200).json({
                status: true,
                message: [{ description: "data retrieve successfully." }],
                notifications:result
            });
        }else{
            return res.status(200).json({
                status: true,
                message: [{ description: "No Records found" }]
            });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: [{ description: "Internal Server Problem" }]
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId,userId } = req.body;

        if (!notificationId) {
            return res.status(400).json({
                status: false,
                message: [{ description: "Notification ID is required" }]
            });
        }

        const [result] = await db.query(
            "UPDATE notifications SET isRead = 'Y' WHERE id = ? AND userId = ?",
            [notificationId,userId]
        );

        if (result.affectedRows === 0) {
            return res.status(200).json({
                status: false,
                message: [{ description: "Notification not found" }]
            });
        }

        return res.status(200).json({
            status: true,
            message: [{ description: "Notification marked as read" }]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: [{ description: "Internal Server Problem" }]
        });
    }
};






module.exports = { createGroup , addMembers,groupsList, groupbelongMemberList,approveMember,notifications,markNotificationAsRead};