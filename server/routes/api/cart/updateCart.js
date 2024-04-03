
const express = require('express');
const { updateCart } = require('../../../controllers/cart/updateCart');
const router = express.Router();

router.route('/').post( updateCart)


module.exports = router;