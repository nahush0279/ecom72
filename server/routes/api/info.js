const express = require('express');
const {  getUser, getAllUsers} = require('../../controllers/infoController');
const router = express.Router();

router.route('/').get( getUser)
router.route('/all').get(getAllUsers)

module.exports = router;