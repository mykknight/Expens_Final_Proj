const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false}));

const Routes = require('./Route/rot');
app.use(Routes);

const sequelize = require('./util/database');

sequelize.sync()
.then((res) => app.listen(4000))
.catch(err => console.log(err));


