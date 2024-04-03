const express = require('express');
const createNewUser = require('../../controllers/registerController');
const router = express.Router();




router.post(
  '/', createNewUser
)

module.exports = router