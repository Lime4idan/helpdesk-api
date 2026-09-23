require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');
const swaggerDocument = require('./docs/swagger');
const { rotaNaoEncontrada, tratarErro } = require('./middlewares/erro');

const app = express();
const porta = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production.');
}

app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(express.json());

app.get('/', (req, res) => res.json({ mensagem: 'HelpDesk API funcionando.', documentacao: '/api-docs' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/chamados', chamadoRoutes);
app.use(rotaNaoEncontrada);
app.use(tratarErro);

if (require.main === module) {
  app.listen(porta, () => console.log(`HelpDesk API available at http://localhost:${porta}`));
}

module.exports = app;
