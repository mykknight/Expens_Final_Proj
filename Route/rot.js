const express = require('express');
const Router = express.Router();

var cors = require('cors');
Router.use(cors());

const UserCont = require('../Controllers/con_signup');

Router.post('/user/signup',UserCont.UserSignUp);

Router.post('/user/login', UserCont.UserLogin);

Router.post('/expense/add-exp', UserCont.addexp);

Router.get('/expense/get-exp', UserCont.allexp);

Router.delete('/expense/dlt-exp/:prodID', UserCont.dltexp);



module.exports = Router;