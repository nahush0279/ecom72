const express = require('express');
const {sendMail, sendReceiptMail}  = require('../../controllers/sendMailController');
const router = express.Router();

router.post('/',  sendMail)

router.post('/receipt',  sendReceiptMail)

module.exports = router;