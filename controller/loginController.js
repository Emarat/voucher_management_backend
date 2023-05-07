const express = require('express');
const router = express.Router();
const { getKeycloakInstance } = require('../config/keycloak-config');
const bodyParser = require('body-parser');

const keycloak = getKeycloakInstance();

// Set up middleware
router.use(keycloak.middleware());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// Define login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    keycloak.grantManager.obtainDirectly(username, password)
        .then((grant) => {
            req.kauth.grant = grant;
            res.send('You are logged in!');
        })
        .catch((error) => {
            res.status(401).send('Invalid username or password');
        });
});

module.exports = router;