const nodemailer = require("nodemailer");

 const sendMail = async (req, res) => {
    const { email, password , name} = req.body
    console.log(email, name, password)
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
        from: '"Nahush Rakholiya" <nahush0279@gmail.com>', // sender address
        to: [`${email}`], // list of receivers
        subject: 'Successfully registered on eCommerce ', // Subject line
        text:  `Hello ${name} , your regisration on eCommerce site is successful with password ${password}`, // plain text body
        html: `<h1>Hello ${name} </h1>
        <h2> your regisration on eCommerce site is successful.</h2>
        <h3>Password : ${password}</h3>
        `, // html body
      });

      console.log("Message sent: %s", info.messageId);
      res.json(info)
}

const sendReceiptMail = async (req, res) => {
    const { email, name, url} = req.body
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
        from: '"Nahush Rakholiya" <nahush0279@gmail.com>', // sender address
        to: [`${email}`], // list of receivers
        subject: 'Invoice of your purchase ', // Subject line
        text:  `Hello ${name} ,your order on eCOM was placed successfully. You can view the invoice by clicking here}`, // plain text body
        html: `
        <h1>Hello ${name},</h1>

        <p>Your order on eCOM was placed successfully.</p>
    
        <p>You can download the invoice by clicking <a href=${url}>here</a>.</p>
    
        <p>Thank you for shopping with us!</p>
        `, 
      });

      res.json(info)
}
module.exports = {
    sendMail, sendReceiptMail
};