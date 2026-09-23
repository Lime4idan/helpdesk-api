const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;
  const token = cabecalho && cabecalho.startsWith('Bearer ')
    ? cabecalho.substring(7)
    : null;

  if (!token) return res.status(401).json({ mensagem: 'Authentication token was not provided.' });

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Authentication token is invalid or expired.' });
  }
}

function apenas(tipo) {
  return (req, res, next) => {
    if (req.usuario.tipo !== tipo) {
      return res.status(403).json({ mensagem: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

module.exports = { autenticar, apenas };
