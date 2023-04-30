require('dotenv').config();
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const migration = async () => {
    try {
        // query mysql untuk membuat table contacts
        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS activities (
                activity_id INT NOT NULL AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (activity_id)
            );
        `
        );
        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS todos (
                todo_id INT NOT NULL AUTO_INCREMENT,
                activity_group_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                priority VARCHAR(255) NOT NULL DEFAULT 'very-high',
                is_active BOOLEAN NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (todo_id),
                FOREIGN KEY (activity_group_id) REFERENCES activities(activity_id) ON DELETE CASCADE
            );
        `
        );
        console.log('Running Migration Successfully!');
    } catch (err) {
        throw err;
    }
};

module.exports = { connection, migration };
