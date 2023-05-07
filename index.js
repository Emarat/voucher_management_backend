const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;
const loginController = require('./controller/loginController.js');
const registerController = require('./controller/registerController.js');


// Enable all cors requests
app.use(cors());

app.use('/', loginController);
app.use('/', registerController);


app.get('/', function (req, res) {
    res.send('Server Started');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
