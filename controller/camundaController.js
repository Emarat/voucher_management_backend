const express = require('express');
const router = express.Router();
const axios = require('axios');

//start process instances
router.post('/start/:key', async (req, res) => {
    try {
        const { key } = req.params;
        // Start a new process instance
        const response = await axios.post(`http://192.168.1.196:8082/engine-rest/process-definition/key/${key}/start`, {
            // Add any required variables or inputs for the process instance
        });

        const processInstanceId = response.data.id;
        console.log(`Started process instance with ID ${processInstanceId}`);

        res.status(200).send({ id: processInstanceId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error starting process instance.');
    }
});


//all active process instances
router.get('/processInstances', async (req, res) => {
    try {
        // Get all active process instances
        const response = await axios.get('http://192.168.1.196:8082/engine-rest/process-instance', {
            params: {
                active: true
            }
        });
        const processInstances = response.data;

        console.log(`Found ${processInstances.length} active process instance(s)`);

        res.status(200).send(processInstances);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting process instances.');
    }
});

//all tasks assigned to a user
router.post('/userTasks', async (req, res) => {
    try {
        // Get all tasks assigned to the current user
        const userId = req.body.userId; // This assumes that the user ID is passed in the request body
        const response = await axios.get(`http://192.168.1.196:8082/engine-rest/task`, {
            // params: {
            //     assignee: userId,
            //     active: true
            // }
        });

        const tasks = response.data;

        console.log(`Found ${tasks.length} task(s) assigned to user ${userId}`);

        res.status(200).send(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting user tasks.');
    }
});


//complete a task by user id
router.post('/completeTask', async (req, res) => {
    try {
        // Complete a task by task ID and user ID
        const taskId = req.body.taskId;
        const userId = req.body.userId;

        await axios.post(`http://192.168.1.196:8082/engine-rest/task/${taskId}/complete`, {
            variables: {
                // Any output variables required by the task
            },
            assignee: userId
        });

        console.log(`Task ${taskId} completed by user ${userId}`);

        res.status(200).send('Task completed successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error completing task.');
    }
});




module.exports = router;