const Chamado = require('../models/Chamado');

function podeVer(chamado, usuario) {
  return usuario.tipo === 'tecnico' || chamado.cliente_id === usuario.id;
}

function podeEditar(chamado, usuario) {
  if (usuario.tipo === 'cliente') return chamado.cliente_id === usuario.id && chamado.status === 'Aberto';
  return chamado.tecnico_id === usuario.id;
}

/**
 * Lista os chamados visíveis ao usuário autenticado.
 * @async
 * @param {import('express').Request} req Requisição com o usuário do JWT.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Lista JSON de chamados.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function listar(req, res, next) {
  try {
    const chamados = await Chamado.listar(req.usuario);
    res.json(chamados);
  } catch (erro) { next(erro); }
}

/**
 * Busca um chamado pelo id e verifica a permissão de leitura.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Chamado em JSON.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function detalhar(req, res, next) {
  try {
    const chamado = await Chamado.buscarPorId(req.params.id);
    if (!chamado) return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    if (!podeVer(chamado, req.usuario)) return res.status(403).json({ mensagem: 'Acesso negado.' });
    res.json(chamado);
  } catch (erro) { next(erro); }
}

/**
 * Cria um chamado para o cliente autenticado.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Chamado criado em JSON.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function criar(req, res, next) {
  try {
    const id = await Chamado.criar(req.body.titulo, req.body.descricao, req.usuario.id);
    const chamado = await Chamado.buscarPorId(id);
    res.status(201).json(chamado);
  } catch (erro) { next(erro); }
}

/**
 * Atualiza título e descrição quando o usuário tem permissão.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Chamado atualizado em JSON.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function atualizar(req, res, next) {
  try {
    const chamado = await Chamado.buscarPorId(req.params.id);
    if (!chamado) return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    if (!podeEditar(chamado, req.usuario)) return res.status(403).json({ mensagem: 'Você não pode editar este chamado.' });
    await Chamado.atualizar(req.params.id, req.body.titulo, req.body.descricao);
    res.json(await Chamado.buscarPorId(req.params.id));
  } catch (erro) { next(erro); }
}

/**
 * Exclui um chamado aberto pertencente ao cliente.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Resposta sem conteúdo.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function excluir(req, res, next) {
  try {
    const chamado = await Chamado.buscarPorId(req.params.id);
    if (!chamado) return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    if (req.usuario.tipo !== 'cliente' || chamado.cliente_id !== req.usuario.id || chamado.status !== 'Aberto') {
      return res.status(403).json({ mensagem: 'Somente o cliente pode excluir seu chamado enquanto ele estiver aberto.' });
    }
    await Chamado.excluir(req.params.id);
    res.status(204).send();
  } catch (erro) { next(erro); }
}

/**
 * Permite que um técnico assuma o chamado e altere seu status.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Chamado atualizado em JSON.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function alterarStatus(req, res, next) {
  try {
    const chamado = await Chamado.buscarPorId(req.params.id);
    if (!chamado) return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    if (chamado.tecnico_id && chamado.tecnico_id !== req.usuario.id) {
      return res.status(403).json({ mensagem: 'Este chamado já foi assumido por outro técnico.' });
    }
    await Chamado.alterarStatus(req.params.id, req.body.status, req.usuario.id);
    res.json(await Chamado.buscarPorId(req.params.id));
  } catch (erro) { next(erro); }
}

module.exports = { listar, detalhar, criar, atualizar, excluir, alterarStatus, podeVer };
