const jwt = require('jsonwebtoken');
const User = require('../Models/signup');

const authentication = (req,res,next) => {

    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, '23102000');
        console.log('UserID>>',user.userId);
        User.findByPk(user.userId)
        .then(user => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch(err => { throw new Error(err)})
    }

    catch(err) { 
        console.log(err);
        return res.status(401).json({sucess: false})
    };
}

module.exports = {
    authentication
};