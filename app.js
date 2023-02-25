const express = require('express');
const app = express();

//const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false}));

const dotenv = require('dotenv');
dotenv.config();

const User = require('./Models/signup');
const Expens = require('./Models/expens');
const Order = require('./Models/Orders');
const Forgotpassword = require('./Models/forgotpassword');
const FileURL = require('./Models/fileURLs');

const Routes = require('./Route/rot');
const purRot = require('./Route/purchase');
const premiumRot = require('./Route/premiumfetch');
const frgt = require('./Route/forgot');

app.use(Routes);
app.use(purRot);
app.use(premiumRot);
app.use(frgt);

app.use((req,res) => {
    console.log('url>>', req.url);
    res.sendFile(path.join(__dirname,`Basics/${req.url}`));
})

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'access.log'),
//     {flag: 'a'}
// );

//app.use(helmet());
app.use(compression());
//app.use(morgan('combined', {stream: accessLogStream}));

User.hasMany(Expens);
Expens.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(FileURL);
FileURL.belongsTo(User);

const sequelize = require('./util/database');

sequelize
//.sync({force: true})
.sync()
.then((res) => app.listen(4000))
.catch(err => console.log(err));


