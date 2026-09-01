const conexao = require('../config/database');

async function buscarPorEmail(email) {
  const [usuarios] = await conexao.execute(
    'SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = ?',
    [email]
  );
  return usuarios[0];
}

async function criar(nome, email, senha, tipo) {
  const [resultado] = await conexao.execute(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, tipo]
  );
  return resultado.insertId;
}

module.exports = { buscarPorEmail, criar };
