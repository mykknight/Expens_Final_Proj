const User = require('../Models/signup');

exports.UserSignUp = async (req,res,next) => {
    const nm = req.body.Name;
    const em = req.body.Email;
    const psd = req.body.Password;

    try {
        await User.create({
            UserName: nm,
            Email: em,
            Password: psd
        });
        res.status(215).json();
    }

    catch(err) {
        res.status(500).json(err);
    }
    
 
}

exports.getUsers = (req,res) => {
    User.findAll()
    .then(users => {
        res.status(210).json(users);
    })
}

exports.UserLogin = async (req,res,next) => {
    const em = req.body.Email;
    const psd = req.body.Password;
    
    User.findAll()
    .then(users => {
        let f=0;
        for(let i=0; i<users.length; i++) {
            if(users[i].Email == em) {
                f=1;
                if(users[i].Password == psd) {
                    return res.status(216).json();
                }
                else return res.status(500).json({msg: 'Password is wrong'});
            }
        }
        if(f==0) return res.status(404).json({msg: 'User does not registered'});
    })
    .catch(err => console.log(err));
}