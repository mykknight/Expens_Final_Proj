const Razorpay = require('razorpay');
const Expens = require('../Models/expens');
const Order = require('../Models/Orders');
const User = require('../Models/signup');
const sequelize = require('../util/database');

exports.Leaderboard = async (req,res) => {
    try {
        const leaderboardOfUser = await User.findAll({
            attributes: ['id', 'UserName', [sequelize.fn('sum', sequelize.col('expens.Amount')), 'total_cost'] ],
            include: [
                {
                    model: Expens,
                    attributes: []
                }
            ],
            group: ['users.id'],
            order: [['total_cost', 'DESC']]
        })
        res.status(200).json(leaderboardOfUser);
    }

    catch(err) {
        console.log(err);
    }
}