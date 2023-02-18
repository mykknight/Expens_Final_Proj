const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false}));

const dotenv = require('dotenv');
dotenv.config();

const User = require('./Models/signup');
const Expens = require('./Models/expens');
const Order = require('./Models/Orders');
const Forgotpassword = require('./Models/forgotpassword');

const Routes = require('./Route/rot');
const purRot = require('./Route/purchase');
const premiumRot = require('./Route/premiumfetch');
const frgt = require('./Route/forgot');

app.use(Routes);
app.use(purRot);
app.use(premiumRot);
app.use(frgt);

User.hasMany(Expens);
Expens.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

const sequelize = require('./util/database');

sequelize
//.sync({force: true})
.sync()
.then((res) => app.listen(4000))
.catch(err => console.log(err));


