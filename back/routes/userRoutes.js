const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Cadastro
router.post('/register', userController.register);

// Perfil
router.get('/profile/:id', userController.getProfile);

module.exports = router;
