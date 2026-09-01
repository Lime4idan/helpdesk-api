const conexao = require('../config/database');

const selecaoBase = `
  SELECT c.*, cliente.nome AS cliente_nome, tecnico.nome AS tecnico_nome
  FROM chamados c
  JOIN usuarios cliente ON cliente.id = c.cliente_id
  LEFT JOIN usuarios tecnico ON tecnico.id = c.tecnico_id`;

async function listar(usuario) {
  if (usuario.tipo === 'cliente') {
    const [chamados] = await conexao.execute(
      `${selecaoBase} WHERE c.cliente_id = ? ORDER BY c.atualizado_em DESC`,
      [usuario.id]
    );
    return chamados;
  }
  const [chamados] = await conexao.execute(`${selecaoBase} ORDER BY c.atualizado_em DESC`);
  return chamados;
}

async function buscarPorId(id) {
  const [chamados] = await conexao.execute(`${selecaoBase} WHERE c.id = ?`, [id]);
  return chamados[0];
}

async function criar(titulo, descricao, clienteId) {
  const [resultado] = await conexao.execute(
    'INSERT INTO chamados (titulo, descricao, cliente_id) VALUES (?, ?, ?)',
    [titulo, descricao, clienteId]
  );
  return resultado.insertId;
}

async function atualizar(id, titulo, descricao) {
  const [resultado] = await conexao.execute(
    'UPDATE chamados SET titulo = ?, descricao = ? WHERE id = ?',
    [titulo, descricao, id]
  );
  return resultado.affectedRows;
}

async function excluir(id) {
  const [resultado] = await conexao.execute('DELETE FROM chamados WHERE id = ?', [id]);
  return resultado.affectedRows;
}

async function alterarStatus(id, status, tecnicoId) {
  const [resultado] = await conexao.execute(
    `UPDATE chamados
     SET status = ?, tecnico_id = CASE WHEN tecnico_id IS NULL THEN ? ELSE tecnico_id END
     WHERE id = ?`,
    [status, tecnicoId, id]
  );
  return resultado.affectedRows;
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, alterarStatus };
