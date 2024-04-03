const nodemailer = require("nodemailer");
const axios = require('axios')

 const sendPasswordMail = async (req, res) => {
    const {email} = req.body
    const response = await axios.get(`${process.env.API_URL}}info?email=${email}`
      );
    const user = response.data;
    let testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure : false,
        auth: {
            user: 'nahush0279@gmail.com',
            pass: 'xfiruxxziudpaamj'
        }
    });

    const info = await transporter.sendMail({
        from: '"Nahush Rakholiya" <nahush0279@gmail.com>', 
        to: [`${user.email}`],
        subject: 'Reset Password', 
        text:  `Hello ${user.name} , your current password is  ${user.password}
                Use this password to reset your password. 
                You can reset your password by clicking here : 
        `, 
        html: ` 
        <p>Hello ${user.name},</p>
        <p>Your current password is <strong>${user.password}</strong>.</p>
        <p>Use this password to reset your password.</p>
        <p>You can reset your password by clicking <a href="${process.env.REACT_URL}reset">here</a>.</p>
        `, 
      });

    //   console.log("Message sent: %s", info.messageId);
      res.json(info)
}
module.exports = 
    sendPasswordMail
;