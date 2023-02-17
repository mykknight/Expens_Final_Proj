const Razorpay = require('razorpay');
const Expens = require('../Models/expens');
const Order = require('../Models/Orders');
const User = require('../Models/signup');
const sequelize = require('../util/database');

exports.Leaderboard = async (req,res) => {
    try {
        const leaderboardOfUser = await User.findAll({
            attributes: ['id', 'UserName', 'TotalCost'],
            order: [['TotalCost', 'DESC']]
        })
        res.status(200).json(leaderboardOfUser);
    }

    catch(err) {
        console.log(err);
    }
}