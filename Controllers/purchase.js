const Razorpay = require('razorpay');
const Order = require('../Models/Orders');


exports.purchasepremium = async (req,res) => {
    try{
        var rzp = new Razorpay({
            key_id: 'rzp_test_sUr2aReyfGipPm',
            key_secret: 'O8vM838XEhrODVL7MCUsONH4'
        })
        const amount = 2500;
        console.log(9);
        rzp.orders.create({ amount, currency: "INR"}, (err,order) => {
            if(err) throw new Error(JSON.stringify(err));
            req.user.createOrder({ orderid: order.id, status: 'PENDING'})
            .then(() => {
                return res.status(201).json({ order, key_id: 'rzp_test_sUr2aReyfGipPm'});

            }).catch(err => {throw new Error(err)})
        })
    }
    catch(err){console.log(err)};
}

exports.purpostpremium = async (req,res) => {

    try {
        const { payment_id, order_id} = req.body;
        if(!payment_id){
            const order = await Order.findOne({where : {orderid: order_id}})
            await order.update({ status: 'FAILURE'})
            await req.user.update({ ispremiumuser: false })
            return res.status(202).json({ sucess: false, message: "Transaction FAILED"});
        }
        const order = await Order.findOne({where : {orderid: order_id}})
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
        const promise2 = req.user.update({ ispremiumuser: true })

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ sucess: true, message: "Transaction Successful"});
        }).catch((err) => {
            throw new Error(err);
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })
    }
}