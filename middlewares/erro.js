function rotaNaoEncontrada(req, res) {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
}

function tratarErro(erro, req, res, next) {
  console.error(erro);
  const resposta = { mensagem: erro.mensagem || 'Erro interno do servidor.' };

  if (process.env.NODE_ENV !== 'production') {
    resposta.detalhe = erro.message;
  }

  res.status(erro.status || 500).json(resposta);
}

module.exports = { rotaNaoEncontrada, tratarErro };
