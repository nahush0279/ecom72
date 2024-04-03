const express = require('express');
const sendPasswordMail  = require('../../controllers/sendPasswordMailController');
const router = express.Router();

router.post('/',  sendPasswordMail)

module.exports = router;