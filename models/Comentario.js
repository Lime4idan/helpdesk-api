const conexao = require('../config/database');

async function listar(chamadoId) {
  const [comentarios] = await conexao.execute(`
    SELECT cc.id, cc.comentario, cc.criado_em, u.id AS usuario_id, u.nome AS usuario_nome, u.tipo AS usuario_tipo
    FROM comentarios_chamado cc
    JOIN usuarios u ON u.id = cc.usuario_id
    WHERE cc.chamado_id = ?
    ORDER BY cc.criado_em ASC
  `, [chamadoId]);
  return comentarios;
}

async function criar(chamadoId, usuarioId, comentario) {
  const [resultado] = await conexao.execute(
    'INSERT INTO comentarios_chamado (chamado_id, usuario_id, comentario) VALUES (?, ?, ?)',
    [chamadoId, usuarioId, comentario]
  );
  return resultado.insertId;
}

module.exports = { listar, criar };
