const swaggerJsdoc = require('swagger-jsdoc');

const opcoes = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HelpDesk API',
      version: '1.0.0',
      description: 'A school support API for creating and tracking tickets.'
    },
    servers: [{ url: '/api', description: 'Current server' }],
    tags: [
      { name: 'Authentication' },
      { name: 'Tickets' },
      { name: 'Comments' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        UsuarioCadastro: {
          type: 'object', required: ['nome', 'email', 'senha', 'tipo'],
          properties: {
            nome: { type: 'string', example: 'Maria Silva' },
            email: { type: 'string', format: 'email', example: 'maria@email.com' },
            senha: { type: 'string', format: 'password', minLength: 6, example: '123456' },
            tipo: { type: 'string', enum: ['cliente', 'tecnico'], example: 'cliente' }
          }
        },
        Login: {
          type: 'object', required: ['email', 'senha'],
          properties: { email: { type: 'string', example: 'maria@email.com' }, senha: { type: 'string', example: '123456' } }
        },
        ChamadoEntrada: {
          type: 'object', required: ['titulo', 'descricao'],
          properties: { titulo: { type: 'string', example: 'Computer will not turn on' }, descricao: { type: 'string', example: 'The computer in room 4 is not turning on.' } }
        },
        Chamado: {
          allOf: [
            { $ref: '#/components/schemas/ChamadoEntrada' },
            { type: 'object', properties: {
              id: { type: 'integer', example: 1 },
              status: { type: 'string', enum: ['Aberto', 'Em Atendimento', 'Concluído'] },
              cliente_id: { type: 'integer' }, tecnico_id: { type: 'integer', nullable: true },
              criado_em: { type: 'string', format: 'date-time' }, atualizado_em: { type: 'string', format: 'date-time' }
            } }
          ]
        },
        Comentario: {
          type: 'object', properties: {
            id: { type: 'integer' }, comentario: { type: 'string' }, usuario_nome: { type: 'string' },
            usuario_tipo: { type: 'string' }, criado_em: { type: 'string', format: 'date-time' }
          }
        },
        Erro: { type: 'object', properties: { mensagem: { type: 'string' } } }
      }
    },
    paths: {
      '/auth/register': {
        post: { tags: ['Authentication'], summary: 'Create an account', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioCadastro' } } } }, responses: { 201: { description: 'Account created' }, 409: { description: 'Email already registered' }, 422: { description: 'Invalid data' } } }
      },
      '/auth/login': {
        post: { tags: ['Authentication'], summary: 'Sign in and return a JWT', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } }, responses: { 200: { description: 'Signed in' }, 401: { description: 'Invalid credentials' } } }
      },
      '/chamados': {
        get: { tags: ['Tickets'], summary: 'List accessible tickets', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Ticket list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Chamado' } } } } }, 401: { description: 'Not authenticated' } } },
        post: { tags: ['Tickets'], summary: 'Open a ticket as a customer', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChamadoEntrada' } } } }, responses: { 201: { description: 'Ticket created' }, 403: { description: 'Customers only' } } }
      },
      '/chamados/{id}': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        get: { tags: ['Tickets'], summary: 'Get ticket details', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Ticket found' }, 404: { description: 'Not found' } } },
        put: { tags: ['Tickets'], summary: 'Edit title and description', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChamadoEntrada' } } } }, responses: { 200: { description: 'Ticket updated' }, 403: { description: 'Permission denied' } } },
        delete: { tags: ['Tickets'], summary: 'Delete your own open ticket', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Ticket deleted' }, 403: { description: 'Permission denied' } } }
      },
      '/chamados/{id}/status': {
        patch: { tags: ['Tickets'], summary: 'Claim a ticket and update its status', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['Aberto', 'Em Atendimento', 'Concluído'] } } } } } }, responses: { 200: { description: 'Status updated' }, 403: { description: 'Permission denied' } } }
      },
      '/chamados/{id}/comentarios': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        get: { tags: ['Comments'], summary: 'List ticket comments', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Comment list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Comentario' } } } } } } },
        post: { tags: ['Comments'], summary: 'Add a comment to a ticket', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['comentario'], properties: { comentario: { type: 'string', example: 'The problem is still happening.' } } } } } }, responses: { 201: { description: 'Comment created' }, 403: { description: 'No access to this ticket' } } }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(opcoes);
