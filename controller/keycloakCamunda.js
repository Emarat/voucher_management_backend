const express = require('express');
const router = express.Router();
const axios = require('axios');

// Set up variables
const keycloakUrl = 'http://192.168.1.196:8181/auth/admin/realms/RVMS_REALM/users';
const camundaUrl = 'http://192.168.1.196:8082/engine-rest/user/create';

// Set up Keycloak authentication headers
const keycloakHeaders = {
    Authorization: 'Bearer your-keycloak-token',
    'Content-Type': 'application/json',
};

// Helper function to format the user data
function formatUserData(userList) {
    return userList.map(user => {
        return {
            "profile": {
                "id": user.username,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email || null
            },
            "credentials": {
                "password": null // we don't have information about passwords in the provided data
            }
        };
    });
}

router.get('/users', async (req, res) => {
    try {
        // Retrieve all users from Keycloak
        const response = await axios.get(keycloakUrl, { headers: keycloakHeaders });
        const users = response.data;
        console.log(users);

        // Format the user data for Camunda
        const formattedUsers = formatUserData(users);
        console.log(formattedUsers);

        // Create each user in Camunda
        // for (const user of formattedUsers) {
        //     const camundaResponse = await axios.post(camundaUrl, user);
        //     if (camundaResponse.status !== 200) {
        //         console.error('Error creating user:', camundaResponse.data);
        //     } else {
        //         console.log('User created successfully!');
        //     }
        // }

        // res.json({ message: 'Users created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating users' });
    }
});

module.exports = router;
