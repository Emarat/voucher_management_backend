const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//account type route
router.get('/accountType', async (req, res) => {
    try {
        const query = 'SELECT * FROM account_type';
        const results = await pool.query(query);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})


//account details type route
router.get('/accountDetailsType', async (req, res) => {
    try {
        const query = 'SELECT * FROM account_detail_type';
        const results = await pool.query(query);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

//accounts route
router.route('/accounts')
    .post(async (req, res) => {
        try {
            const { account_name, parent, account_type, account_type_id, account_details_type, account_details_type_id, init_bal_cash, init_bal_bank, description } = req.body;

            // Inserting data into PostgreSQL database
            const query =
                'INSERT INTO accounts (  account_name, parent, account_type_id, account_details_type_id, init_bal_cash, init_bal_bank, description) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            await pool.query(query, [account_name, parent, account_type_id, account_details_type_id, init_bal_cash, init_bal_bank, description]);

            res.status(201).send('Chart Of Account Created Successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })

    .get(async (req, res) => {
        try {
            const query = 'SELECT accounts.account_id, accounts.parent, accounts.account_name, trim(account_type.account_type_name) as account_type_name, trim(account_detail_type.account_detail_name) as account_detail_type_name, accounts.init_bal_cash, accounts.init_bal_bank, accounts.description FROM accounts LEFT JOIN account_type on accounts.account_type_id = account_type.account_type_id LEFT JOIN account_detail_type on accounts.account_details_type_id = account_detail_type.account_detail_type_id ';

            const results = await pool.query(query);
            res.json(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    });

//update chart of account
router.patch('/accounts/:id', async (req, res) => {
    try {
        const { account_name, parent, account_type_id, account_details_type_id, init_bal_cash, init_bal_bank, description, status } = req.body;
        const account_id = req.params.id;

        // Updating data in PostgreSQL database
        const query =
            'UPDATE accounts SET account_name=$1, parent=$2, account_type_id=$3, account_details_type_id=$4, init_bal_cash=$5, init_bal_bank=$6, description=$7, status=$8 WHERE account_id=$9';
        await pool.query(query, [account_name, parent, account_type_id, account_details_type_id, init_bal_cash, init_bal_bank, description, status, account_id]);

        res.status(200).send('Chart Of Account Updated Successfully!');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});




module.exports = router;

