const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();
const serverUrl = process.env.KEYCLOAK_SERVER_URL;
const realmName = process.env.KEYCLOAK_REALM;
const clientId = process.env.KEYCLOAK_CLIENT_ID;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;



// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    try {
        // Get access token from Keycloak
        const tokenResponse = await axios({
            method: 'POST',
            url: `${serverUrl}/auth/realms/master/protocol/openid-connect/token`,
            data: `client_id=admin-cli&client_secret=2l7P3fJl8kdX99HxOQXGSfZ4gkZ06BZ0&grant_type=client_credentials`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const accessToken = tokenResponse.data.access_token;

        const Data = {
            "username": req.body.username,
            "email": req.body.email,
            "enabled": true,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "credentials": [
                {
                    "type": "password",
                    "value": req.body.password,
                    "temporary": false
                }
            ]
        };

        // console.log(Data.username);

        // Make user registration request using access token
        const response = await axios({
            method: 'POST',
            url: `${serverUrl}/auth/admin/realms/${realmName}/users/`,
            data: Data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log(`User ${Data.username} created successfully!`);
        res.status(201).json(response.data);
    } catch (error) {
        console.error(error.response.data);
        res.status(500).send('Error creating user!');
    }
});

module.exports = router;
