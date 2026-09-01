const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;
  const token = cabecalho && cabecalho.startsWith('Bearer ')
    ? cabecalho.substring(7)
    : null;

  if (!token) return res.status(401).json({ mensagem: 'Token não informado.' });

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

function apenas(tipo) {
  return (req, res, next) => {
    if (req.usuario.tipo !== tipo) {
      return res.status(403).json({ mensagem: 'Você não possui permissão para esta ação.' });
    }
    next();
  };
}

module.exports = { autenticar, apenas };
