const express = require('express');
const {  updateUser } = require('../../controllers/updateController');
const router = express.Router();

router.post('/', updateUser)

module.exports = router;