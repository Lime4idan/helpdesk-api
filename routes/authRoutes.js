const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const verificarValidacao = require('../middlewares/validacao');

const router = express.Router();

router.post('/register', [
  body('nome').trim().isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),
  body('email').isEmail().withMessage('Informe um e-mail válido.').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
  body('tipo').isIn(['cliente', 'tecnico']).withMessage('O tipo deve ser cliente ou tecnico.'),
  verificarValidacao
], authController.cadastrar);

router.post('/login', [
  body('email').isEmail().withMessage('Informe um e-mail válido.').normalizeEmail(),
  body('senha').notEmpty().withMessage('Informe a senha.'),
  verificarValidacao
], authController.entrar);

module.exports = router;
