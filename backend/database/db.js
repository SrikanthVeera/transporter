const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'srikanth12345',
    database: process.env.DB_NAME || 'transporter_app', // Updated DB name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL Database: ' + (process.env.DB_NAME || 'transporter_app'));
        connection.release();
    } catch (err) {
        console.error('❌ Database Connection Failed:', err.message);
    }
})();

module.exports = pool;
