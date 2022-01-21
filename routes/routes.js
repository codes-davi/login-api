const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/DefaultController');
const usersController = require('../controllers/UsersController');
const authHandler = require('../handlers/auth-handler');
const cors = require('cors');

router.use(cors());

router.get('/', defaultController.index);
router.post('/user', usersController.create);
router.get('/user', authHandler, usersController.index);
router.get('/user/:id', usersController.findOne);
router.put('/user', usersController.edit);
router.delete('/user/:id', authHandler, usersController.delete);
router.post('/recover', usersController.recoverPassword);
router.post('/changepassword', usersController.changePassword);
router.post('/login', usersController.login);

module.exports = router;