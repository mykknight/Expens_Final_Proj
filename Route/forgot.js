const express = require('express');
const Router = express.Router();

var cors = require('cors');
Router.use(cors());

const controller = require('../Controllers/forgot_cont');

Router.post('/password/forgotpassword', controller.Forgotpassword);

Router.get('/password/updatepassword/:resetpasswordid', controller.updatepassword)

Router.get('/password/resetpassword/:id', controller.resetpassword)

module.exports = Router;