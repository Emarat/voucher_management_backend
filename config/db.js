const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '192.168.1.196',
    database: 'Voucher_Management',
    password: 'postgres',
    port: 5432,
});

pool.query('SELECT * FROM customers', (err, res) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
    } else {
        console.log('Successfully connected to the database');
    }
    pool.end();
});

module.exports = pool;