const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;
const loginController = require('./controller/loginController.js');
const registerController = require('./controller/registerController.js');
const customerController = require('./controller/customerController.js');
const productControlller = require('./controller/productController.js');
const chartOfAccountController = require('./controller/chartOfAccountController.js');


// Enable all cors requests
app.use(cors());

app.use('/', loginController);
app.use('/', registerController);
app.use('/', customerController);
app.use('/', productControlller);
app.use('/', chartOfAccountController);


app.get('/', function (req, res) {
    res.send('Server Started');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
