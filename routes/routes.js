const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/DefaultController');
const usersController = require('../controllers/UsersController');

router.get('/', defaultController.index);
router.post('/user', usersController.create);

module.exports = router;