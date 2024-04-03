const express = require('express');
const {removeToken}  = require('../../controllers/tokenController');
const router = express.Router();

router.post('/',  removeToken)

module.exports = router;