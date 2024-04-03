const express = require('express');
const productUpdate  = require('../../controllers/productUpdateController');
const router = express.Router();

router.post('/', productUpdate)

module.exports = router;