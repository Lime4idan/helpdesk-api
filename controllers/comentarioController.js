const Chamado = require('../models/Chamado');
const Comentario = require('../models/Comentario');
const { podeVer } = require('./chamadoController');

async function carregarChamadoPermitido(req, res) {
  const chamado = await Chamado.buscarPorId(req.params.id);
  if (!chamado) {
    res.status(404).json({ mensagem: 'Ticket not found.' });
    return null;
  }
  if (!podeVer(chamado, req.usuario)) {
    res.status(403).json({ mensagem: 'Access denied.' });
    return null;
  }
  return chamado;
}

/**
 * Lista os comentários de um chamado acessível ao usuário.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Lista de comentários em JSON.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function listar(req, res, next) {
  try {
    if (!await carregarChamadoPermitido(req, res)) return;
    res.json(await Comentario.listar(req.params.id));
  } catch (erro) { next(erro); }
}

/**
 * Adiciona um comentário ao chamado acessível ao usuário.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Comentário criado em JSON.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function criar(req, res, next) {
  try {
    if (!await carregarChamadoPermitido(req, res)) return;
    const id = await Comentario.criar(req.params.id, req.usuario.id, req.body.comentario);
    const comentarios = await Comentario.listar(req.params.id);
    res.status(201).json(comentarios.find(comentario => comentario.id === id));
  } catch (erro) { next(erro); }
}

module.exports = { listar, criar };
