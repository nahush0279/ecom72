const { getData } = require('../../../controllers/cart/getCart');
const express = require('express');
const router = express.Router();

router.route('/').get( getData)


module.exports = router;