const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../Models/signup');
const Forgotpassword = require('../Models/forgotpassword');

exports.Forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        console.log(email);
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
           await user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })
            //console.log(process.env.API_KEY);
           return res.status(200).json({ message: 'Link to reset your passsword is sent to your mail', success: true, id:id })
            // sgMail.setApiKey('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')

            // const msg = {
            //     to: 'kishorkhatri24@gmail.com', // Change to your recipient
            //     from: 'khatrimayank24@gmail.com', // Change to your verified sender
            //     subject: 'Sending with SendGrid is Fun',
            //     text: 'and easy to do anywhere, even with Node.js',
            //     html: `<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`,
            // }

            // sgMail
            // .send(msg)
            // .then((response) => {

            //     // console.log(response[0].statusCode)
            //     // console.log(response[0].headers)
            //     res.redirect(`/password/resetpassword/${id}`);
            //    // return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            // })
            // .catch((error) => {
            //     throw new Error(error);                                                                              
            // })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports.updatepassword = (req, res) => {

    try {

        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        console.log(newpassword, resetpasswordid);
        Forgotpassword.findByPk(resetpasswordid)
        .then(resetpasswordrequest => {
            User.findByPk(resetpasswordrequest.UserId).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ Password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}
