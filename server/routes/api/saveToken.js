const express = require('express');
const {saveToken}  = require('../../controllers/tokenController');
const router = express.Router();

router.post('/',  saveToken)

module.exports = router;