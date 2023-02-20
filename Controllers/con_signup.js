const User = require('../Models/signup');
const Expens = require('../Models/expens');
const FileURL = require('../Models/fileURLs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');

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
    const t = await sequelize.transaction()

    try {
        const data = await Expens.create({ Amount, Description, Category, UserId: req.user.id}, {transaction: t});
        let newcost;
        console.log(req.user.TotalCost + '+++' + Amount);
        if(req.user.TotalCost){
            newcost = +req.user.TotalCost + +Amount;
        }
        else newcost = Amount;
        console.log(newcost);
        await req.user.update( {TotalCost: newcost}, {transaction: t} );
        await t.commit();
        return res.status(215).json({newEx: data});
    }

    catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).json({ sucess: false, error: err});
    }
}

exports.allexp = async (req,res,next) => {

    try {
        let allowitem = Number(req.params.nom);
        const page = req.query.page || 1;
        console.log('aaa>>>', Number(allowitem), 'bbb>>', page);
        let totalexp;
        await Expens.count()
        .then((total) => {
            totalexp = total;
            return Expens.findAll({
                where: {UserId: req.user.id},
                offset: (page-1) * allowitem,
                limit: allowitem,
            });
        })
        .then((expens) => {
            //console.log(expens);
            res.status(216).json({
                prm: req.user.ispremiumuser,
                expenses: expens,
                currentPage: page,
                hasnextPage: allowitem * page < totalexp,
                nextPage: Number(page) + 1,
                haspreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalexp/allowitem),
            });
        })
        .catch(err => {
            throw new Error(err);
        })
    //    const exps = await Expens.findAll({ where: {UserId: req.user.id}});
    //    res.status(216).json({exps: exps, prm: req.user.ispremiumuser});
    }
    catch(err){console.log(err)};
}

exports.dltexp = async (req,res,next) => {
    const id = req.params.prodID;
    const t = await sequelize.transaction();

    try{
        const prc = await Expens.findByPk(id);
        const newcost = req.user.TotalCost - prc.Amount;
        await Expens.destroy({ where: {id: id}}, {transaction: t});
        await req.user.update( {TotalCost: newcost}, {transaction: t});
        await t.commit();
        return res.status(217).json({ msg: 'sucessfully deleted'});
    }

    catch(err){
        await t.rollback();
        console.log(err);
        return res.status(400).json({msg: 'Something went wrong'});
    };
}

function uploadToS3(data, fileName) {
    const BUCKET_NAME = 'expenstrackingapp2';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3( {
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        //Bucket: BUCKET_NAME
    })

        var params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if(err) {
                    console.log('Something went wrong', err);
                    reject(err);
                }
                else {
                    console.log('sucess', s3response);
                    resolve(s3response.Location);
                }
            })
        })

}

exports.downloadExp = async (req,res,next) => {

    try {
        const expss = await req.user.getExpens();
        // console.log(expss);
         const stringifiedexps = JSON.stringify(expss);
         const id = req.user.id;
         const fileName = `Expens${id}/${new Date()}.txt`;
         const fileURL = await uploadToS3(stringifiedexps, fileName);
         console.log(fileURL);
         await FileURL.create({fileURL, UserId: id});
         res.status(200).json({ fileURL, success: true});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ fileURL: '', success: false, err: err});
    }

}