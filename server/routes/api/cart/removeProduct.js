const removeProduct  = require('../../../controllers/cart/removeProduct');
const express = require('express');
const router = express.Router();

router.route('/').post( removeProduct)


module.exports = router;