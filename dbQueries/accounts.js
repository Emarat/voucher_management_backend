const pool = require('../config/db');

// Get all account types
const getAccountTypes = async () => {
    try {
        const query = 'SELECT * FROM account_type';
        const results = await pool.query(query);
        return results.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Get all account details types
const getAccountDetailsTypes = async () => {
    try {
        const query = 'SELECT * FROM account_detail_type';
        const results = await pool.query(query);
        return results.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Create a new chart of account
const createChartOfAccount = async (
    account_name,
    parent,
    account_type_id,
    account_details_type_id,
    init_bal_cash,
    init_bal_bank,
    description,
    status
) => {
    try {
        const query =
            'INSERT INTO accounts (account_name, parent, account_type_id, account_details_type_id, init_bal_cash, init_bal_bank, description, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
        await pool.query(query, [
            account_name,
            parent,
            account_type_id,
            account_details_type_id,
            init_bal_cash,
            init_bal_bank,
            description,
            status,
        ]);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Get all accounts
const getAccounts = async () => {
    try {
        const query =
            'SELECT accounts.account_id, accounts.status, accounts.parent, accounts.account_name, trim(account_type.account_type_name) as account_type_name, trim(account_detail_type.account_detail_name) as account_detail_type_name, accounts.init_bal_cash, accounts.init_bal_bank,accounts.description,parent_account.account_name as parent_name FROM accounts LEFT JOIN account_type ON accounts.account_type_id = account_type.account_type_id LEFT JOIN account_detail_type ON accounts.account_details_type_id = account_detail_type.account_detail_type_id LEFT JOIN accounts as parent_account ON accounts.parent = parent_account.account_id';
        const results = await pool.query(query);
        return results.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Get an account by ID
const getAccountById = async (account_id) => {
    try {
        const query = 'SELECT * FROM accounts WHERE account_id = $1';
        const result = await pool.query(query, [account_id]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            throw new Error('Account not found');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Update a chart of account
const updateChartOfAccount = async (
    account_name,
    parent,
    account_type_id,
    account_details_type_id,
    init_bal_cash,
    init_bal_bank,
    description,
    status,
    account_id
) => {
    try {
        const query =
            'UPDATE accounts SET account_name=$1, parent=$2, account_type_id=$3, account_details_type_id=$4, init_bal_cash=$5, init_bal_bank=$6, description=$7, status=$8 WHERE account_id=$9';
        await pool.query(query, [
            account_name,
            parent,
            account_type_id,
            account_details_type_id,
            init_bal_cash,
            init_bal_bank,
            description,
            status,
            account_id,
        ]);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Delete an account by ID
const deleteAccountById = async (account_id) => {
    try {
        const query = 'DELETE FROM accounts WHERE account_id=$1';
        await pool.query(query, [account_id]);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Delete multiple accounts
const deleteAccounts = async (accountIds) => {
    try {
        let deletedCount = 0;
        for (const id of accountIds) {
            const result = await pool.query('DELETE FROM accounts WHERE account_id = $1', [id]);

            if (result.rowCount >= 1) {
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            return 'Accounts deleted successfully!';
        } else {
            throw new Error('Accounts not found');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Get parent accounts
const getParentAccounts = async () => {
    try {
        const query = 'SELECT account_id, account_name FROM accounts';
        const results = await pool.query(query);
        return results.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    getAccountTypes,
    getAccountDetailsTypes,
    createChartOfAccount,
    getAccounts,
    getAccountById,
    updateChartOfAccount,
    deleteAccountById,
    deleteAccounts,
    getParentAccounts,
};
