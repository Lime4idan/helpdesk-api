# HelpDesk API

A JSON REST API for opening, tracking, and resolving support tickets. Customers can access their own tickets; technicians can review the queue, claim tickets, change their status, and add comments.

- **Live API:** https://helpdesk-api-t1hv.onrender.com
- **Swagger UI:** https://helpdesk-api-t1hv.onrender.com/api-docs

## Stack

- Node.js and Express
- MySQL with `mysql2/promise`
- JWT and `bcryptjs`
- CORS restricted to the configured frontend
- `express-validator`
- Swagger UI and Swagger JSDoc
- `dotenv`

## Local setup

1. Install Node.js and MySQL.
2. Run `npm install`.
3. Run `database/schema.sql` in MySQL.
4. Copy `.env.example` to `.env`, fill in the values, and use a long random `JWT_SECRET`.
5. Start development with `npm run dev`.

The API runs at `http://localhost:3001`; Swagger UI is available at `http://localhost:3001/api-docs`. Use `npm start` for a regular production-style start.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | API port |
| `DB_HOST`, `DB_PORT` | MySQL host and port |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Database credentials and name |
| `DB_SSL` | Enable SSL when required by the provider |
| `DB_SSL_REJECT_UNAUTHORIZED` | Control SSL server verification |
| `DB_SSL_CA_BASE64` | Base64-encoded database CA certificate |
| `JWT_SECRET` | Long secret used to sign tokens |
| `FRONTEND_URL` | Exact frontend origin allowed by CORS |
| `NODE_ENV` | Runtime environment |

Never commit real credentials to GitHub.

## Main routes

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET`, `POST`, `PUT`, and `DELETE /api/chamados`
- `PATCH /api/chamados/:id/status`
- `GET` and `POST /api/chamados/:id/comentarios`

Private routes expect `Authorization: Bearer TOKEN`. The login endpoint returns the token consumed by the frontend.

## Architecture

- `config` — MySQL connection
- `models` — prepared statements and data access
- `controllers` — business rules and JSON responses
- `middlewares` — JWT authentication, validation, and errors
- `routes` — REST endpoints
- `docs` — Swagger specification
- `database` — database creation script

## Deployment

The API uses the port provided by Render. Configure every value from `.env.example`, especially `FRONTEND_URL` with the exact Vercel origin instead of `*`. For Aiven, enable SSL and provide its CA certificate through `DB_SSL_CA_BASE64`.

`render.yaml` supports Render Blueprints without storing database credentials or the frontend origin in the repository.
