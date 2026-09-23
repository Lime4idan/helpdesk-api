const { validationResult } = require('express-validator');

function verificarValidacao(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(422).json({
      mensagem: 'Invalid data.',
      erros: erros.array().map(erro => erro.msg)
    });
  }
  next();
}

module.exports = verificarValidacao;
