const express = require('express');
const deleteUser = require('../../controllers/deleteController');
const router = express.Router();




router.post(
  '/', deleteUser
)

module.exports = router