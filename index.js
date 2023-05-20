const express = require('express');
const cors = require('cors')
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const port = 3000;
const loginController = require('./controller/loginController.js');
const registerController = require('./controller/registerController.js');
const customerController = require('./controller/customerController.js');
const productControlller = require('./controller/productController.js');
const accountsController = require('./controller/accountsController.js');
const categoryController = require('./controller/categoryController');
const vendorController = require('./controller/vendorController');
const uomController = require('./controller/uomController.js');
const camundaController = require('./controller/camundaController.js');
// const keycloakCamunda = require('./controller/keycloakCamunda.js');
const formController = require('./controller/formController.js');


//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enable all cors requests
app.use(cors());

app.use('/', loginController);
app.use('/', registerController);
app.use('/', customerController);
app.use('/', productControlller);
app.use('/', accountsController);
app.use('/', categoryController);
app.use('/', vendorController);
app.use('/', uomController);
app.use('/', camundaController);
// app.use('/', keycloakCamunda);
app.use('/', formController);


app.get('/', function (req, res) {
    res.send('Server Started');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
