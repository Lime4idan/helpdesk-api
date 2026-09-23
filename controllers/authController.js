const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Cadastra um usuário com a senha protegida.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Resposta JSON com o usuário criado.
 * @throws {Error} Encaminha erros do banco ao middleware global.
 */
async function cadastrar(req, res, next) {
  try {
    const existente = await Usuario.buscarPorEmail(req.body.email);
    if (existente) return res.status(409).json({ mensagem: 'This email address is already registered.' });

    const senhaProtegida = await bcrypt.hash(req.body.senha, 10);
    const id = await Usuario.criar(req.body.nome, req.body.email, senhaProtegida, req.body.tipo);
    res.status(201).json({ mensagem: 'Account created successfully.', usuario: { id, nome: req.body.nome, email: req.body.email, tipo: req.body.tipo } });
  } catch (erro) {
    next(erro);
  }
}

/**
 * Autentica o usuário e devolve um JWT com id e tipo.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Resposta JSON com token e dados públicos.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function entrar(req, res, next) {
  try {
    const usuario = await Usuario.buscarPorEmail(req.body.email);
    const senhaCorreta = usuario && await bcrypt.compare(req.body.senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ mensagem: 'Incorrect email address or password.' });

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo } });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { cadastrar, entrar };
