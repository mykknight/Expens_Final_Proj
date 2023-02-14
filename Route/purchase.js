const express = require('express');
const Router = express.Router();
const userauthentication = require('../middleware/auth');

var cors = require('cors');
Router.use(cors());

const purchaseContl = require('../Controllers/purchase');

Router.get('/purchase/premiummembership', userauthentication.authentication, purchaseContl.purchasepremium);

Router.post('/purchase/updatetransactionstatus', userauthentication.authentication, purchaseContl.purpostpremium);

module.exports = Router;