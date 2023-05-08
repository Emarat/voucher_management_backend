const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.route('/chartAccount')
    .post(async (req, res) => {
        try {
            const { account_type, detail_type, name, parent_account, description } = req.body;

            // Inserting data into PostgreSQL database
            const query =
                'INSERT INTO chart_of_accounts (account_type, detail_type, name, parent_account, description) VALUES ($1, $2, $3, $4, $5)';
            await pool.query(query, [account_type, detail_type, name, parent_account, description]);

            res.status(201).send('Chart Of Account Created Successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
    .get(async (req, res) => {
        try {
            const query = 'SELECT * FROM chart_of_accounts';
            const results = await pool.query(query);
            res.json(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })

module.exports = router;

