require('dotenv').config();
const Keycloak = require('keycloak-connect');


function getKeycloakInstance() {
    return new Keycloak({
        'scope': 'openid',
        'realm': process.env.KEYCLOAK_REALM,
        'auth-server-url': process.env.KEYCLOAK_SERVER_URL,
        'ssl-required': process.env.SSL_REQUIRED, // set to "external" if using HTTPS in production
        'resource': process.env.KEYCLOAK_CLIENT_ID,
        'bearerOnly': false, // disable redirect for login
    });
}

module.exports = { getKeycloakInstance };
