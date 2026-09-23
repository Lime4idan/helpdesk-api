function rotaNaoEncontrada(req, res) {
  res.status(404).json({ mensagem: 'Route not found.' });
}

function tratarErro(erro, req, res, next) {
  console.error(erro);
  const resposta = { mensagem: erro.mensagem || 'Internal server error.' };

  if (process.env.NODE_ENV !== 'production') {
    resposta.detalhe = erro.message;
  }

  res.status(erro.status || 500).json(resposta);
}

module.exports = { rotaNaoEncontrada, tratarErro };
