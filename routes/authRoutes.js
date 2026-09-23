const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const verificarValidacao = require('../middlewares/validacao');

const router = express.Router();

router.post('/register', [
  body('nome').trim().isLength({ min: 3 }).withMessage('Name must contain at least 3 characters.'),
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters.'),
  body('tipo').isIn(['cliente', 'tecnico']).withMessage('Account type must be cliente or tecnico.'),
  verificarValidacao
], authController.cadastrar);

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('senha').notEmpty().withMessage('Enter your password.'),
  verificarValidacao
], authController.entrar);

module.exports = router;
