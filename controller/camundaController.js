const express = require('express');
const router = express.Router();
const axios = require('axios');

//start process instances
router.post('/start/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const response = await axios.post(
      `http://192.168.1.196:8082/engine-rest/process-definition/key/${key}/start`,
      {}
    );

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
    const response = await axios.get(
      'http://192.168.1.196:8082/engine-rest/process-instance',
      {
        params: {
          active: true,
        },
      }
    );
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
    // const userId = req.body.userId;
    const response = await axios.get(
      `http://192.168.1.196:8082/engine-rest/task`,
      {
        // params: {
        //     assignee: userId,
        //     active: true
        // }
      }
    );

    const tasks = response.data;

    // console.log(`Found ${tasks.length} task(s) assigned to user ${userId}`);

    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting user tasks.');
  }
});

//complete a task by user id
router.post('/completeTask', async (req, res) => {
  try {
    const taskId = req.body.taskId;
    const userId = req.body.userId;

    await axios.post(
      `http://192.168.1.196:8082/engine-rest/task/${taskId}/complete`,
      {
        variables: {},
        assignee: userId,
      }
    );

    console.log(`Task ${taskId} completed by user ${userId}`);

    res.status(200).send('Task completed successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error completing task.');
  }
});

module.exports = router;
