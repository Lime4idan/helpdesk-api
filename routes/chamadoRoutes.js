const express = require('express');
const { body, param } = require('express-validator');
const chamadoController = require('../controllers/chamadoController');
const comentarioController = require('../controllers/comentarioController');
const { autenticar, apenas } = require('../middlewares/autenticacao');
const verificarValidacao = require('../middlewares/validacao');

const router = express.Router();
const validarId = param('id').isInt({ min: 1 }).withMessage('Invalid ID.');
const validarChamado = [
  body('titulo').trim().isLength({ min: 3, max: 150 }).withMessage('Title must contain between 3 and 150 characters.'),
  body('descricao').trim().isLength({ min: 10 }).withMessage('Description must contain at least 10 characters.')
];

router.use(autenticar);
router.get('/', chamadoController.listar);
router.get('/:id', validarId, verificarValidacao, chamadoController.detalhar);
router.post('/', apenas('cliente'), validarChamado, verificarValidacao, chamadoController.criar);
router.put('/:id', validarId, validarChamado, verificarValidacao, chamadoController.atualizar);
router.delete('/:id', validarId, verificarValidacao, chamadoController.excluir);
router.patch('/:id/status', apenas('tecnico'), [
  validarId,
  body('status').isIn(['Aberto', 'Em Atendimento', 'Concluído']).withMessage('Invalid status.'),
  verificarValidacao
], chamadoController.alterarStatus);
router.get('/:id/comentarios', validarId, verificarValidacao, comentarioController.listar);
router.post('/:id/comentarios', [
  validarId,
  body('comentario').trim().isLength({ min: 2, max: 2000 }).withMessage('Comment must contain between 2 and 2,000 characters.'),
  verificarValidacao
], comentarioController.criar);

module.exports = router;
