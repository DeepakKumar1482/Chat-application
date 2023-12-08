const express = require('express');
const {
    loginController,
    registerController,
    getuserController,
    contactDataController,
    savedcontactsController
} = require('../Controller/userController.js');
const authmiddlwear = require("../Controller/authmiddlewear.js");
const router = express.Router();
router.post('/login', loginController);
router.post('/register', registerController);
router.get('/getUser', authmiddlwear, getuserController);
router.post('/ContactData', authmiddlwear, contactDataController);
router.get("/savedcontacts", authmiddlwear, savedcontactsController);
module.exports = router;