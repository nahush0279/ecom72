const express = require('express');
const { getProduct, getAllProducts } = require('../../controllers/productsInfoController');

const router = express.Router();

router.route('/').post( getProduct)
router.route('/all').get(getAllProducts)

module.exports = router;