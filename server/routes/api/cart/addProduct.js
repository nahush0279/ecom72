const addProduct  = require('../../../controllers/cart/addProduct');
const express = require('express');
const router = express.Router();

router.route('/').post( addProduct)


module.exports = router;