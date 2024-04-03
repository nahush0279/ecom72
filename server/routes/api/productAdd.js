const express = require('express');
const productAdd  = require('../../controllers/productAddController');
const router = express.Router();

router.post('/', productAdd)

module.exports = router;