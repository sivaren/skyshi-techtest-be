const { connection } = require('../database/database');

const getAllActivities = async (req, res) => {
    try {
        const statement = "SELECT activity_id as id, title, email, created_at as createdAt, updated_at as updatedAt FROM activities ORDER BY activity_id ASC";
        const [rows] = await connection.query(statement);
        res.status(200).json({
            status: "Success",
            message: "Success",
            data: rows,
        });
    } catch (err) {
        res.status(400).json({
            status: "Not Found",
            message: "Not Found",
        });
    } 
};

const getOneActivity = async (req, res) => {
    const id = req.params.id;
    try {
        const statement = "SELECT activity_id as id, title, email, created_at as createdAt, updated_at as updatedAt FROM activities WHERE activity_id=?";
        const [rows] = await connection.execute(statement, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: "Not Found",
                message: `Activity with ID ${id} Not Found`,
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Success",
            data: rows[0],
        });
    } catch (err) {
        res.status(400).json({
            status: "Bad Request",
            message: err.message,
        });
    } 
};

const createActivity = async (req, res) => {
    try {
        const { title, email } = req.body;
        if (title != "") {
            const statement = "INSERT INTO activities (title, email) VALUES (?, ?)";
            const [result] = await connection.execute(statement, [title, email]);
            res.status(201).json({
                status: "Success",
                message: "Success",
                data: {
                    id: result.insertId,
                    title,
                    email,
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                },
            });
        }
        else if (title == "") {
            res.status(400).json({
                status: "Bad Request",
                message: "title cannot be null",
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "Not Found",
            message: err.message,
        });
    } 
};

const updateActivity = async (req, res) => {
    const id = req.params.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            status: "Bad Request",
            message: "title cannot be null",
        });
    }

    try {
        const statement = "SELECT * FROM activities WHERE activity_id=?";
        const [rows] = await connection.execute(statement, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: "Not Found",
                message: `Activity with ID ${id} Not Found`,
            });
        }

        const updateStatement = "UPDATE activities SET title=?, updated_at=NOW() WHERE activity_id=?";
        const result = await connection.execute(updateStatement, [title, id]);

        const selectStatement = "SELECT activity_id as id, title, email, created_at as createdAt, updated_at as updatedAt FROM activities WHERE activity_id=?";
        const [updatedRows] = await connection.execute(selectStatement, [id]);

        res.status(200).json({
            status: "Success",
            message: "Success",
            data: updatedRows[0],
        });
    } catch (err) {
        res.status(500).json({
            status: "Internal Server Error",
            message: "An error occurred while updating activity",
        });
    } 
};

const deleteActivity = async (req, res) => {
    const id = req.params.id;

    try {
        const statement = "SELECT * FROM activities WHERE activity_id=?";
        const [rows] = await connection.execute(statement, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: "Not Found",
                message: `Activity with ID ${id} Not Found`,
            });
        }

        const deleteStatement = "DELETE FROM activities WHERE activity_id = ?";
        const [result] = await connection.execute(deleteStatement, [id]);
    
        res.status(200).json({
          status: "Success",
          message: "Success",
          data: {},
        });
      } catch (err) {
        res.status(500).json({
            status: "Internal Server Error",
            message: err.message,
        });
      }
};

module.exports = {
    getAllActivities,
    getOneActivity,
    createActivity,
    updateActivity,
    deleteActivity,
};
