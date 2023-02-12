const express = require('express');
const Router = express.Router();

var cors = require('cors');
Router.use(cors());

const UserCont = require('../Controllers/con_signup');

Router.post('/user/signup',UserCont.UserSignUp);

Router.post('/user/login', UserCont.UserLogin);



module.exports = Router;