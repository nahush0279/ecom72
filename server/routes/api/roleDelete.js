const express = require('express');
const deleteRole = require('../../controllers/roleDeleteController');
const router = express.Router();

router.post('/', deleteRole)

module.exports = router;