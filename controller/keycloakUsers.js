const express = require('express');
const router = express.Router();
const axios = require('axios');
const bodyParser = require('body-parser');

const serverUrl = process.env.KEYCLOAK_SERVER_URL;
const realmName = process.env.KEYCLOAK_REALM;
const clientId = process.env.KEYCLOAK_CLIENT_ID;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;


// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/users', async (req, res) => {
    try {
        const tokenResponse = await axios({
            method: 'POST',
            url: `${serverUrl}/auth/realms/master/protocol/openid-connect/token`,
            data: `client_id=admin-cli&client_secret=2l7P3fJl8kdX99HxOQXGSfZ4gkZ06BZ0&grant_type=client_credentials`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const accessToken = tokenResponse.data.access_token;

        const response = await axios({
            method: 'GET',
            url: `${serverUrl}/auth/admin/realms/${realmName}/users`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // console.log(`Retrieved ${response.data.length} users!`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.response.data);
        res.status(500).send('Error retrieving users!');
    }
});

module.exports = router;
