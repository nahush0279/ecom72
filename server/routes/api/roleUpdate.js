const express = require('express');
const {updateRole}  = require('../../controllers/roleUpdateController');
const router = express.Router();

router.post('/', updateRole)

module.exports = router;