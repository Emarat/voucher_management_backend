const express = require('express');
const router = express.Router();
const { getKeycloakInstance } = require('../config/keycloak-config');
const bodyParser = require('body-parser');

const keycloak = getKeycloakInstance();
// console.log(keycloak);

// Set up middleware
router.use(keycloak.middleware());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Define login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  keycloak.grantManager
    .obtainDirectly(username, password)
    .then((grant) => {
      req.kauth.grant = grant;
      const user = grant.access_token.content;
      const realmRoles = grant.access_token.content.realm_access?.roles;
      const resourceRoles = grant.access_token.content.resource_access;
      const specificRoles = resourceRoles.campaign_clients?.roles;
      const token = req.kauth.grant.access_token;
      // console.log(user);
      // console.log('realmRoles', realmRoles);
      // console.log('resourceRoles', resourceRoles);
      console.log('specificRoles', specificRoles);
      console.log('token', token);
      res.json({
        message: 'You are logged in!',
        user: {
          id: user.sid,
          name: user.preferred_username,
          email: user.email,
          roles: specificRoles,
        },
        token: token.token,
      });
      return;
    })
    .catch((error) => {
      console.log(error);
      res.status(401).send('Invalid username or password');
    });
});

module.exports = router;
