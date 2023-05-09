const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vms',
    password: 'postgres',
    port: 5440,
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