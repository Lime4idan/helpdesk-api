# HelpDesk API

API REST em JSON para abrir, acompanhar e atender chamados de suporte. Clientes enxergam seus próprios chamados; técnicos visualizam a fila, assumem chamados, mudam o status e comentam.

## Tecnologias

- Node.js e Express
- MySQL com `mysql2/promise`
- JWT e `bcryptjs`
- CORS restrito ao frontend configurado
- `express-validator`
- Swagger UI e Swagger JSDoc
- `dotenv`

## Como instalar

1. Instale Node.js e MySQL.
2. Nesta pasta, execute:

```bash
npm install
```

3. Execute `database/schema.sql` no MySQL.
4. Copie `.env.example` para `.env` e preencha os dados. Use uma `JWT_SECRET` longa e aleatória.
5. Inicie:

```bash
npm run dev
```

A API estará em `http://localhost:3001` e o Swagger em `http://localhost:3001/api-docs`. Para execução normal, use `npm start`.

## Variáveis de ambiente

| Variável | Finalidade |
| --- | --- |
| `PORT` | Porta usada pela API. |
| `DB_HOST` | Endereço do servidor MySQL. |
| `DB_PORT` | Porta do MySQL, normalmente `3306`. |
| `DB_USER` | Usuário do banco. |
| `DB_PASSWORD` | Senha do banco. |
| `DB_NAME` | Nome do banco, normalmente `helpdesk`. |
| `DB_SSL` | Use `true` quando o provedor exigir SSL. |
| `DB_SSL_REJECT_UNAUTHORIZED` | Controla a validação do servidor SSL. |
| `JWT_SECRET` | Segredo longo usado para assinar os tokens. |
| `FRONTEND_URL` | Origem exata do frontend autorizada pelo CORS. |
| `NODE_ENV` | Use `development` localmente e `production` no deploy. |

Os nomes também estão disponíveis no arquivo `.env.example`. Credenciais reais não devem ser enviadas ao GitHub.

## Rotas principais

- `POST /api/auth/register` e `POST /api/auth/login`
- `GET`, `POST`, `PUT` e `DELETE /api/chamados`
- `PATCH /api/chamados/:id/status`
- `GET` e `POST /api/chamados/:id/comentarios`

As rotas privadas esperam `Authorization: Bearer TOKEN`. O login devolve o token usado pelo frontend.

## Arquitetura

- `config`: conexão MySQL.
- `models`: prepared statements e acesso aos dados.
- `controllers`: regras e respostas JSON.
- `middlewares`: JWT, validação e erros.
- `routes`: endpoints REST.
- `docs`: especificação Swagger.
- `database`: criação do banco.

## Deploy

O projeto usa a porta fornecida pelo Render. Configure todas as variáveis do `.env.example`, principalmente `FRONTEND_URL` com a origem exata do site publicado na Vercel, sem usar `*`. No Aiven, use `DB_SSL=true` quando o serviço exigir SSL; a verificação do servidor fica ativa por padrão. Depois do deploy, a documentação continuará disponível em `/api-docs`.

O arquivo `render.yaml` permite criar o serviço pelo recurso Blueprint do Render. Durante a criação, o painel solicita os dados privados do banco e a origem do frontend; esses valores não ficam gravados no repositório.
