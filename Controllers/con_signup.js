const User = require('../Models/signup');
const Expens = require('../Models/expens');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.UserSignUp = (req,res,next) => {

    const { UserName, Email, Password} = req.body

    try {
        const salt = 10;
        bcrypt.hash(Password, salt, async (err, hash) => {
            if(err) console.log(err);
            await User.create({ UserName, Email, Password: hash});
            res.status(201).json();
        })
    }

    catch(err) {
        res.status(500).json(err);
    }
}   

exports.UserLogin = async (req,res,next) => {

    function generateAccessToken(id,name) {
        return jwt.sign({ userId: id, name: name}, '23102000');
    }

    try {
    const Email = req.body.Email;
    const Password = req.body.Password;
    
    const user = await User.findAll({where : { Email }});

    if(user[0]){
        bcrypt.compare(Password, user[0].Password, (err, output) => {

            if(err) return res.status(500).json({ msg: 'Something went wrong'});

            if(output==true) {
                //res.redirect('A:\ExpensTrak-final-Proj\Basics\expens.html');
                return res.status(201).json({sucess: true, msg: 'User login sucessfully', token: generateAccessToken(user[0].id, user[0].UserName)});
            }

            else return res.status(404).json({msg: 'Password is wrong'});
        })
    }
    else return res.status(400).json({msg: 'User Does not exist'});  
   }
   catch(err){console.log(err)};
}

exports.addexp = async (req,res,next) => {

    const { Amount, Description, Category} = req.body;

    try {
        const data = await Expens.create({ Amount, Description, Category, UserId: req.user.id});
        let newcost;
        console.log(req.user.TotalCost + '+++' + Amount);
        if(req.user.TotalCost){
            newcost = +req.user.TotalCost + +Amount;
        }
        else newcost = Amount;
        console.log(newcost);
        req.user.update( {TotalCost: newcost} );
        res.status(215).json({newEx: data});
    }

    catch(err){console.log(err)};
}

exports.allexp = async (req,res,next) => {

    try {
       const exps = await Expens.findAll({ where: {UserId: req.user.id}});
       res.status(216).json({exps: exps, prm: req.user.ispremiumuser});
    }
    catch(err){console.log(err)};
}

exports.dltexp = async (req,res,next) => {
    const id = req.params.prodID;

    try{
        await Expens.destroy({ where: {id: id}});
        res.status(217).json();
    }

    catch(err){console.log(err)};
}