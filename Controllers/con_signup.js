const User = require('../Models/signup');

exports.UserSignUp = async (req,res,next) => {
    const nm = req.body.Name;
    const em = req.body.Email;
    const psd = req.body.Password;

    await User.create({
        UserName: nm,
        Email: em,
        Password: psd
    })
    .then(() => {
        console.log('User sucessfully created');
        res.status(215).json();
    })
    .catch((err) => {
        res.status(500).json(err);
    })
}