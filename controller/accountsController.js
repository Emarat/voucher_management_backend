const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const pool = require('../config/db');
const {
  getAllAccountTypes,
  getAllAccountDetailsTypes,
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccountById,
  deleteAccountById,
  deleteAccountsByIds,
  getParentAccounts,
} = require('../Query/accountsQueries');
// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//account type route
// Account type route
router.get('/accountType', async (req, res) => {
  const accountTypes = await getAllAccountTypes();
  res.json(accountTypes);
});

// Account details type route
router.get('/accountDetailsType', async (req, res) => {
  const accountDetailsTypes = await getAllAccountDetailsTypes();
  res.json(accountDetailsTypes);
});

// Accounts route
router
  .route('/accounts')
  .post(async (req, res) => {
    const accountData = req.body;
    const success = await createAccount(accountData);

    if (success) {
      res.status(201).send('Chart Of Account Created Successfully!');
    } else {
      res.sendStatus(500);
    }
  })
  .get(async (req, res) => {
    const accounts = await getAllAccounts();
    res.json(accounts);
  });

// Get account data by ID
router.get('/accounts/:id', async (req, res) => {
  const accountId = req.params.id;
  const account = await getAccountById(accountId);

  if (account) {
    res.status(200).json(account);
  } else {
    res.status(404).send('Account not found');
  }
});

// Update chart of account
router.patch('/accounts/:id', async (req, res) => {
  try {
    const accountId = req.params.id;
    const accountData = req.body;

    const success = await updateAccountById(accountId, accountData);

    if (success) {
      res.status(200).send('Chart Of Account Updated Successfully!');
    } else {
      res.status(500).send('Failed to update Chart Of Account');
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Delete account by ID
router.delete('/accounts/:id', async (req, res) => {
  try {
    const accountId = req.params.id;

    const success = await deleteAccountById(accountId);

    if (success) {
      res.status(200).send('Chart Of Account Deleted Successfully!');
    } else {
      res.status(500).send('Failed to delete Chart Of Account');
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Delete multiple accounts
router.delete('/accounts', async (req, res) => {
  const accountIds = req.body.ids;

  try {
    const deletedCount = await deleteAccountsByIds(accountIds);

    if (deletedCount > 0) {
      res.status(200).send('Accounts deleted successfully!');
    } else {
      res.status(404).json({ error: 'Accounts not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get parent accounts
router.get('/parent', async (req, res) => {
  try {
    const parentAccounts = await getParentAccounts();
    res.json(parentAccounts);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
