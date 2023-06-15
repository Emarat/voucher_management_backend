const pool = require('./../config/db');

//account type route
const getAllAccountTypes = async () => {
  try {
    const query = 'SELECT * FROM account_type';
    const results = await pool.query(query);
    return results.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
};

//account details type route
const getAllAccountDetailsTypes = async () => {
  try {
    const query = 'SELECT * FROM account_detail_type';
    const results = await pool.query(query);
    return results.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
};

//create accounts
const createAccount = async (accountData) => {
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
    } = accountData;

    const query = `
        INSERT INTO accounts (
          account_name,
          parent,
          account_type_id,
          account_details_type_id,
          init_bal_cash,
          init_bal_bank,
          description,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

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

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

//get all accounts
const getAllAccounts = async () => {
  try {
    const query = `
        SELECT
          accounts.account_id,
          accounts.status,
          accounts.parent,
          accounts.account_name,
          TRIM(account_type.account_type_name) AS account_type_name,
          TRIM(account_detail_type.account_detail_name) AS account_detail_type_name,
          accounts.init_bal_cash,
          accounts.init_bal_bank,
          accounts.description,
          parent_account.account_name AS parent_name
        FROM
          accounts
          LEFT JOIN account_type ON accounts.account_type_id = account_type.account_type_id
          LEFT JOIN account_detail_type ON accounts.account_details_type_id = account_detail_type.account_detail_type_id
          LEFT JOIN accounts AS parent_account ON accounts.parent = parent_account.account_id
        WHERE
          accounts.account_name <> 'Root'`;

    const results = await pool.query(query);
    return results.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
};

//get account by id
const getAccountById = async (accountId) => {
  try {
    const query = `
        SELECT
          a.*,
          at.account_type_name,
          adt.account_detail_name,
          p.account_name AS parent_name
        FROM
          accounts AS a
          LEFT JOIN account_type AS at ON a.account_type_id = at.account_type_id
          LEFT JOIN account_detail_type AS adt ON a.account_details_type_id = adt.account_detail_type_id
          LEFT JOIN accounts AS p ON a.parent = p.account_id
        WHERE
          a.account_id = $1`;

    const result = await pool.query(query, [accountId]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

//update chart of accounts by id
const updateAccountById = async (accountId, accountData) => {
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
    } = accountData;

    const query = `
        UPDATE accounts
        SET
          account_name = $1,
          parent = $2,
          account_type_id = $3,
          account_details_type_id = $4,
          init_bal_cash = $5,
          init_bal_bank = $6,
          description = $7,
          status = $8
        WHERE
          account_id = $9
      `;

    await pool.query(query, [
      account_name,
      parent,
      account_type_id,
      account_details_type_id,
      init_bal_cash,
      init_bal_bank,
      description,
      status,
      accountId,
    ]);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

//delete account by id
const deleteAccountById = async (accountId) => {
  try {
    const query = 'DELETE FROM accounts WHERE account_id = $1';
    await pool.query(query, [accountId]);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

//delete multiple accounts
const deleteAccountsByIds = async (accountIds) => {
  try {
    let deletedCount = 0;
    for (const id of accountIds) {
      const result = await pool.query(
        'DELETE FROM accounts WHERE account_id = $1',
        [id]
      );

      if (result.rowCount >= 1) {
        deletedCount++;
      }
    }

    return deletedCount;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//get parent accounts
const getParentAccounts = async () => {
  try {
    const query = 'SELECT account_id, account_name FROM accounts';
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAllAccountTypes,
  getAllAccountDetailsTypes,
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccountById,
  deleteAccountById,
  deleteAccountsByIds,
  getParentAccounts,
};
