const express = require('express');
const Router = express.Router();
const userauthentication = require('../middleware/auth');

var cors = require('cors');
Router.use(cors());

const UserCont = require('../Controllers/con_signup');

Router.post('/user/signup',UserCont.UserSignUp);

Router.post('/user/login', UserCont.UserLogin);

Router.post('/expense/add-exp', userauthentication.authentication , UserCont.addexp);

Router.get('/expense/get-exp/pref/:nom', userauthentication.authentication , UserCont.allexp);

Router.delete('/expense/dlt-exp/:prodID', userauthentication.authentication , UserCont.dltexp);

Router.get('/userfile/download', userauthentication.authentication ,UserCont.downloadExp);



module.exports = Router;