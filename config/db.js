require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    'user': process.env.DB_USER,
    'host': process.env.DB_HOST,
    'database': process.env.DB_NAME,
    'password': process.env.DB_PASSWORD,
    'port': process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
    } else {
        console.log('Successfully connected to the database');
    }
    // pool.end();
});

module.exports = pool;