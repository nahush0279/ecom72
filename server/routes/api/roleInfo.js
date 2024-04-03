const express = require('express');
const {  getRole, getAllRoles , getRoleByName} = require('../../controllers/roleInfoController');
const router = express.Router();

router.route('/').get( getRole)
router.route('/all').get(getAllRoles)
router.route('/name').get(getRoleByName)

module.exports = router;