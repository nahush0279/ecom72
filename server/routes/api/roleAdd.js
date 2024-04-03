const express = require('express');
const createNewRole = require('../../controllers/roleAddController');
const router = express.Router();




router.post(
  '/', createNewRole
)

module.exports = router