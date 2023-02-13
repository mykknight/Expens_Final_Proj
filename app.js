const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false}));

const User = require('./Models/signup');
const Expens = require('./Models/expens');

const Routes = require('./Route/rot');
app.use(Routes);

User.hasMany(Expens);
Expens.belongsTo(User);

const sequelize = require('./util/database');

sequelize
//.sync({force: true})
.sync()
.then((res) => app.listen(4000))
.catch(err => console.log(err));


