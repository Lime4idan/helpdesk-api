const swaggerJsdoc = require('swagger-jsdoc');

const opcoes = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HelpDesk API',
      version: '1.0.0',
      description: 'API escolar para cadastro e acompanhamento de chamados.'
    },
    servers: [{ url: '/api', description: 'Servidor atual' }],
    tags: [
      { name: 'Autenticação' },
      { name: 'Chamados' },
      { name: 'Comentários' }
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
          properties: { titulo: { type: 'string', example: 'Computador não liga' }, descricao: { type: 'string', example: 'O computador da sala 4 não está ligando.' } }
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
        post: { tags: ['Autenticação'], summary: 'Cadastra um usuário', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioCadastro' } } } }, responses: { 201: { description: 'Usuário criado' }, 409: { description: 'E-mail já cadastrado' }, 422: { description: 'Dados inválidos' } } }
      },
      '/auth/login': {
        post: { tags: ['Autenticação'], summary: 'Realiza login e retorna um JWT', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } }, responses: { 200: { description: 'Login realizado' }, 401: { description: 'Credenciais incorretas' } } }
      },
      '/chamados': {
        get: { tags: ['Chamados'], summary: 'Lista chamados permitidos', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Lista de chamados', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Chamado' } } } } }, 401: { description: 'Não autenticado' } } },
        post: { tags: ['Chamados'], summary: 'Abre um chamado (cliente)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChamadoEntrada' } } } }, responses: { 201: { description: 'Chamado criado' }, 403: { description: 'Apenas clientes' } } }
      },
      '/chamados/{id}': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        get: { tags: ['Chamados'], summary: 'Detalha um chamado', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Chamado encontrado' }, 404: { description: 'Não encontrado' } } },
        put: { tags: ['Chamados'], summary: 'Edita título e descrição', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChamadoEntrada' } } } }, responses: { 200: { description: 'Chamado atualizado' }, 403: { description: 'Sem permissão' } } },
        delete: { tags: ['Chamados'], summary: 'Exclui chamado próprio e aberto', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Chamado excluído' }, 403: { description: 'Sem permissão' } } }
      },
      '/chamados/{id}/status': {
        patch: { tags: ['Chamados'], summary: 'Técnico assume e altera o status', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['Aberto', 'Em Atendimento', 'Concluído'] } } } } } }, responses: { 200: { description: 'Status alterado' }, 403: { description: 'Sem permissão' } } }
      },
      '/chamados/{id}/comentarios': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        get: { tags: ['Comentários'], summary: 'Lista comentários do chamado', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Lista de comentários', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Comentario' } } } } } } },
        post: { tags: ['Comentários'], summary: 'Adiciona comentário ao chamado', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['comentario'], properties: { comentario: { type: 'string', example: 'O problema continua.' } } } } } }, responses: { 201: { description: 'Comentário criado' }, 403: { description: 'Sem acesso ao chamado' } } }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(opcoes);
