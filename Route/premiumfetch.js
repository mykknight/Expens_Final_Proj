const express = require('express');
const Router = express.Router();
const userauthentication = require('../middleware/auth');

var cors = require('cors');
Router.use(cors());

const premiumCont = require('../Controllers/premiumCont');

Router.get('/premium/leaderboard', userauthentication.authentication, premiumCont.Leaderboard);


module.exports = Router;