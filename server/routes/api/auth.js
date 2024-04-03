const handleLogin = require('../../controllers/authController.js');
const express = require('express');
const router = express.Router();

router.post(
  '/',
  handleLogin
)

module.exports = router
