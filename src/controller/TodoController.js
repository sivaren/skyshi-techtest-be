const { connection } = require('../database/database');

const getAllTodos = async (req, res) => {
    try {
        const { activity_group_id } = req.query;
        // with query
        if (activity_group_id) {
            const statement = `
                SELECT DISTINCT todo_id as id, activity_group_id, todos.title, is_active, priority, todos.created_at as createdAt, todos.updated_at as updatedAt 
                FROM todos INNER JOIN activities ON todos.activity_group_id = ?
                ORDER BY todo_id ASC
            `;
            const [rows] = await connection.query(statement, [activity_group_id]);
            const data = rows.map(row => ({
                ...row,
                is_active: row.is_active === 1 ? true : (row.is_active === 0 ? false : null)
            }));
            res.status(200).json({
                status: "Success",
                message: "Success",
                data: data,
            });
        }
        else { // without query
            const statement = "SELECT todo_id as id, activity_group_id, title, is_active, priority, created_at as createdAt, updated_at as updatedAt FROM todos ORDER BY todo_id ASC";
            const [rows] = await connection.query(statement);
            const data = rows.map(row => ({
                ...row,
                is_active: row.is_active === 1 ? true : (row.is_active === 0 ? false : null)
            }));
            res.status(200).json({
                status: "Success",
                message: "Success",
                data: data,
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "Not Found",
            message: "Not Found",
        });
    }
};

const getOneTodo = async (req, res) => {
    const id = req.params.id;
    try {
        const statement = "SELECT todo_id as id, activity_group_id, title, is_active, priority, created_at as createdAt, updated_at as updatedAt FROM todos WHERE todo_id=?";
        const [rows] = await connection.execute(statement, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: "Not Found",
                message: `Todo with ID ${id} Not Found`,
            });
        }
        const data = {
            ...rows[0],
            is_active: rows[0].is_active === 1 ? true : (rows[0].is_active === 0 ? false : null)
        };
        res.status(200).json({
            status: "Success",
            message: "Success",
            data: data,
        });
    } catch (err) {
        res.status(400).json({
            status: "Bad Request",
            message: err.message,
        });
    } 
};

const createTodo = async (req, res) => {
    try {
        const { title, activity_group_id, is_active } = req.body;
        if (title && activity_group_id && (is_active==true || is_active==false || is_active==null)) {
            const statement = "INSERT INTO todos (activity_group_id, title, is_active) VALUES (?, ?, ?)";
            const [result] = await connection.execute(statement, [activity_group_id, title, is_active]);
            res.status(201).json({
                status: "Success",
                message: "Success",
                data: {
                    id: result.insertId,
                    title,
                    activity_group_id,
                    is_active,
                    priority: "very-high",
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                },
            });
        }
        else if (!title) {
            res.status(400).json({
                status: "Bad Request",
                message: "title cannot be null",
            });
        }
        else if (!activity_group_id) {
            res.status(400).json({
                status: "Bad Request",
                message: "activity_group_id cannot be null",
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "Bad Request",
            message: "title cannot be null",
        });
    } 
};

const updateTodo = async (req, res) => {
    const id = req.params.id;
    const { title, priority, is_active, status } = req.body;

    try {
        const statement = "SELECT * FROM todos WHERE todo_id=?";
        const [rows] = await connection.execute(statement, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: "Not Found",
                message: `Todo with ID ${id} Not Found`,
            });
        }

        const updateStatement = "UPDATE todos SET title=?, priority=?, is_active=?, updated_at=NOW() WHERE todo_id=?";
        const result = await connection.execute(updateStatement, [title, priority, is_active, id]);

        const selectStatement = "SELECT todo_id as id, activity_group_id, title, is_active, priority, created_at as createdAt, updated_at as updatedAt FROM todos WHERE todo_id=?";
        const [updatedRows] = await connection.execute(selectStatement, [id]);

        const data = {
            ...updatedRows[0],
            is_active: updatedRows[0].is_active === 1 ? true : (updatedRows[0].is_active === 0 ? false : null)
        };
        res.status(200).json({
            status: "Success",
            message: "Success",
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            status: "Internal Server Error",
            message: "An error occurred while updating activity",
        });
    } 
};

const deleteTodo = async (req, res) => {
    const id = req.params.id;
    const { title } = req.body;

    try {
        const statement = "SELECT * FROM todos WHERE todo_id=?";
        const [rows] = await connection.execute(statement, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: "Not Found",
                message: `Todo with ID ${id} Not Found`,
            });
        }

        const deleteStatement = "DELETE FROM todos WHERE todo_id = ?";
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
    getAllTodos,
    getOneTodo,
    createTodo,
    updateTodo,
    deleteTodo,
};
