const express = require('express');
const productDelete = require('../../controllers/productDelete');
const router = express.Router();

router.post('/', productDelete)

module.exports = router;