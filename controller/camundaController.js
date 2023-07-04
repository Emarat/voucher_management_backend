const express = require('express');
const router = express.Router();
const axios = require('axios');

let processInstanceId = '';
let taskList = [];

// Start process instances and call task API
router.post('/start/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const startResponse = await axios.post(
      `http://192.168.1.196:8082/engine-rest/process-definition/key/${key}/start`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    processInstanceId = startResponse.data.id;
    console.log(`Started process instance with ID ${processInstanceId}`);

    const taskResponse = await axios.get(
      `http://192.168.1.196:8082/engine-rest/task`,
      {
        params: {
          processInstanceId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    taskList = taskResponse.data;

    res.status(200).send({ id: processInstanceId, tasks: taskList });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error starting process instance.');
  }
});

// Get task list for the last started process instance
router.get('/tasks', async (req, res) => {
  try {
    if (!processInstanceId) {
      return res.status(400).send('No process instance ID available.');
    }

    res.status(200).send(taskList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving task list.');
  }
});

// Complete the first task in the task list and call task API
router.post('/complete', async (req, res) => {
  try {
    if (taskList.length === 0) {
      return res.status(400).send('No tasks available to complete.');
    }

    const taskId = taskList[0].id; // Get the ID of the first task in the list
    taskList = taskList.slice(1); // Remove the completed task from the list

    await axios.post(
      `http://192.168.1.196:8082/engine-rest/task/${taskId}/complete`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`Completed task with ID ${taskId}`);

    // Call the task API after completing the task
    const taskResponse = await axios.get(
      `http://192.168.1.196:8082/engine-rest/task`,
      {
        params: {
          processInstanceId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    taskList = taskResponse.data;

    res.status(200).send('Task completed successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error completing task.');
  }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// let processInstanceId = '';
// let taskList = [];

// // Start process instances
// router.post('/start/:key', async (req, res) => {
//   try {
//     const { key } = req.params;

//     const response = await axios.post(
//       `http://192.168.1.196:8082/engine-rest/process-definition/key/${key}/start`,
//       {},
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     processInstanceId = response.data.id;
//     console.log(`Started process instance with ID ${processInstanceId}`);

//     res.status(200).send({ id: processInstanceId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error starting process instance.');
//   }
// });

// // Get task list for the last started process instance
// router.get('/tasks', async (req, res) => {
//   try {
//     if (!processInstanceId) {
//       return res.status(400).send('No process instance ID available.');
//     }

//     const response = await axios.get(
//       `http://192.168.1.196:8082/engine-rest/task`,
//       {
//         params: {
//           processInstanceId,
//         },
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     taskList = response.data;
//     res.status(200).send(taskList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving task list.');
//   }
// });

// // Complete the first task in the task list and call task API
// router.post('/complete', async (req, res) => {
//   try {
//     if (taskList.length === 0) {
//       return res.status(400).send('No tasks available to complete.');
//     }

//     const taskId = taskList[0].id; // Get the ID of the first task in the list
//     taskList = taskList.slice(1); // Remove the completed task from the list

//     await axios.post(
//       `http://192.168.1.196:8082/engine-rest/task/${taskId}/complete`,
//       {},
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log(`Completed task with ID ${taskId}`);

//     // Call the task API after completing the task
//     const taskResponse = await axios.get(
//       `http://192.168.1.196:8082/engine-rest/task`,
//       {
//         params: {
//           processInstanceId,
//         },
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     taskList = taskResponse.data;

//     res.status(200).send('Task completed successfully.');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error completing task.');
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// let processInstanceId = '';
// let taskList = [];

// // Start process instances
// router.post('/start/:key', async (req, res) => {
//   try {
//     const { key } = req.params;

//     const response = await axios.post(
//       `http://192.168.1.196:8082/engine-rest/process-definition/key/${key}/start`,
//       {},
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     processInstanceId = response.data.id;
//     console.log(`Started process instance with ID ${processInstanceId}`);

//     res.status(200).send({ id: processInstanceId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error starting process instance.');
//   }
// });

// // Get task list for the last started process instance
// router.get('/tasks', async (req, res) => {
//   try {
//     if (!processInstanceId) {
//       return res.status(400).send('No process instance ID available.');
//     }

//     const response = await axios.get(
//       `http://192.168.1.196:8082/engine-rest/task`,
//       {
//         params: {
//           processInstanceId,
//         },
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     taskList = response.data;
//     res.status(200).send(taskList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving task list.');
//   }
// });

// // Complete the first task in the task list
// router.post('/complete', async (req, res) => {
//   try {
//     if (taskList.length === 0) {
//       return res.status(400).send('No tasks available to complete.');
//     }

//     const taskId = taskList[0].id; // Get the ID of the first task in the list
//     taskList = taskList.slice(1); // Remove the completed task from the list

//     const response = await axios.post(
//       `http://192.168.1.196:8082/engine-rest/task/${taskId}/complete`,
//       {},
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log(`Completed task with ID ${taskId}`);

//     res.status(200).send('Task completed successfully.');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error completing task.');
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// let processInstanceId = '';

// // Start process instances
// router.post('/start/:key', async (req, res) => {
//   try {
//     const { key } = req.params;

//     const response = await axios.post(
//       `http://192.168.1.196:8082/engine-rest/process-definition/key/${key}/start`,
//       {}
//     );

//     processInstanceId = response.data.id;
//     console.log(`Started process instance with ID ${processInstanceId}`);

//     res.status(200).send({ id: processInstanceId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error starting process instance.');
//   }
// });

// // Get task list for the last started process instance
// router.get('/tasks', async (req, res) => {
//   try {
//     if (!processInstanceId) {
//       return res.status(400).send('No process instance ID available.');
//     }

//     const response = await axios.get(
//       `http://192.168.1.196:8082/engine-rest/task`,
//       {
//         params: {
//           processInstanceId,
//         },
//       }
//     );

//     const taskList = response.data;
//     res.status(200).send(taskList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving task list.');
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// //start process instances
// router.post('/start/:key', async (req, res) => {
//   try {
//     const { key } = req.params;

//     const response = await axios.post(
//       `http://192.168.1.196:8082/engine-rest/process-definition/key/${key}/start`,
//       {}
//     );

//     const processInstanceId = response.data.id;
//     console.log(`Started process instance with ID ${processInstanceId}`);

//     res.status(200).send({ id: processInstanceId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error starting process instance.');
//   }
// });

// //all active process instances
// router.get('/processInstances', async (req, res) => {
//   try {
//     const response = await axios.get(
//       'http://192.168.1.196:8082/engine-rest/process-instance',
//       {
//         params: {
//           active: true,
//         },
//       }
//     );
//     const processInstances = response.data;

//     console.log(`Found ${processInstances.length} active process instance(s)`);

//     res.status(200).send(processInstances);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error getting process instances.');
//   }
// });

// //all tasks assigned to a user
// router.post('/userTasks', async (req, res) => {
//   try {
//     // const userId = req.body.userId;
//     const response = await axios.get(
//       `http://192.168.1.196:8082/engine-rest/task`,
//       {
//         // params: {
//         //     assignee: userId,
//         //     active: true
//         // }
//       }
//     );

//     const tasks = response.data;

//     // console.log(`Found ${tasks.length} task(s) assigned to user ${userId}`);

//     res.status(200).send(tasks);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error getting user tasks.');
//   }
// });

// //complete a task by user id
// router.post('/completeTask', async (req, res) => {
//   try {
//     const taskId = req.body.taskId;
//     const userId = req.body.userId;

//     await axios.post(
//       `http://192.168.1.196:8082/engine-rest/task/${taskId}/complete`,
//       {
//         variables: {},
//         assignee: userId,
//       }
//     );

//     console.log(`Task ${taskId} completed by user ${userId}`);

//     res.status(200).send('Task completed successfully!');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error completing task.');
//   }
// });

// module.exports = router;
