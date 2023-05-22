const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {
    getAccountTypes,
    getAccountDetailsTypes,
    createChartOfAccount,
    getAccounts,
    getAccountById,
    updateChartOfAccount,
    deleteAccountById,
    deleteAccounts,
    getParentAccounts,
} = require('../dbQueries/accounts');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Account type route
router.get('/accountType', async (req, res) => {
    try {
        const accountTypes = await getAccountTypes(); //db 
        res.json(accountTypes);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Account details type route
router.get('/accountDetailsType', async (req, res) => {
    try {
        const accountDetailsTypes = await getAccountDetailsTypes(); //db
        res.json(accountDetailsTypes);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Accounts route
router.route('/accounts')
    .post(async (req, res) => {
        try {
            const {
                account_name,
                parent,
                account_type,
                account_type_id,
                account_details_type,
                account_details_type_id,
                init_bal_cash,
                init_bal_bank,
                status,
                description,
            } = req.body;

            await createChartOfAccount(
                account_name,
                parent,
                account_type_id,
                account_details_type_id,
                init_bal_cash,
                init_bal_bank,
                description,
                status
            ); //db

            res.status(201).send('Chart Of Account Created Successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
    .get(async (req, res) => {
        try {
            const accounts = await getAccounts(); //db
            res.json(accounts);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    });

// Get account by ID
router.get('/accounts/:id', async (req, res) => {
    try {
        const account_id = req.params.id;
        const account = await getAccountById(account_id); //db

        res.status(200).json(account);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Update chart of account
router.patch('/accounts/:id', async (req, res) => {
    try {
        const {
            account_name,
            parent,
            account_type_id,
            account_details_type_id,
            init_bal_cash,
            init_bal_bank,
            description,
            status,
        } = req.body;
        const account_id = req.params.id;

        await updateChartOfAccount(
            account_name,
            parent,
            account_type_id,
            account_details_type_id,
            init_bal_cash,
            init_bal_bank,
            description,
            status,
            account_id
        ); //db

        res.status(200).send('Chart Of Account Updated Successfully!');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Delete account by ID
router.delete('/accounts/:id', async (req, res) => {
    try {
        const account_id = req.params.id;

        await deleteAccountById(account_id); //db

        res.status(200).send('Chart Of Account Deleted Successfully!');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Delete multiple accounts
router.delete('/accounts', async (req, res) => {
    const accountIds = req.body.ids;

    try {
        const result = await deleteAccounts(accountIds); //db

        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Accounts not found' });
    }
});

// Get parent accounts
router.get('/parent', async (req, res) => {
    try {
        const parentAccounts = await getParentAccounts(); //db
        res.json(parentAccounts);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;
