import express, { Response } from 'express';
import { logger } from './tools/logger';
import { FlowOrchestrator } from './orchestrator/flow';
import { Phase } from './types';
import { MemoryContextStore } from './tools/context_store';
import { SecurityAdapter } from './tools/security_adapter';
import { AuthMiddleware, AuthenticatedRequest } from './tools/auth_middleware';
import { MCPError, ValidationError, AuthenticationError, AuthorizationError } from './tools/errors';

const app = express();
const PORT = process.env.PORT || 3000;
const authMiddleware = new AuthMiddleware();

/**
 * Servidor de saúde para o MCP Fullcycle.
 * Fornece endpoint /healthz para verificações de disponibilidade.
 */

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));

// Middleware para logging de requests
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Request recebida');
  next();
});

// Middleware de rate limiting global
app.use(authMiddleware.rateLimit(1000, 15 * 60 * 1000)); // 1000 req/15min

// Endpoint de saúde
app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.1.0-beta'
  });
});

// Endpoint de autenticação
app.post('/auth/login', (req, res) => {
  try {
    const { userId, role, permissions } = req.body;

    if (!userId || !role) {
      throw new ValidationError('userId e role são obrigatórios');
    }

    const token = authMiddleware.generateToken(userId, role, permissions || []);
    logger.info({ userId, role }, 'Login realizado com sucesso');

    res.json({
      success: true,
      token,
      user: { id: userId, role, permissions: permissions || [] },
      expiresIn: '24h'
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Endpoint para renovar token
app.post('/auth/refresh', authMiddleware.authenticate, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      throw new AuthenticationError();
    }

    const newToken = authMiddleware.generateToken(
      req.user.id,
      req.user.role,
      req.user.permissions
    );

    res.json({
      success: true,
      token: newToken,
      expiresIn: '24h'
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Middleware de autenticação para endpoints protegidos
app.use('/api', authMiddleware.authenticate);
app.use('/api/admin', authMiddleware.authorize(['admin']));
app.use('/api/moderator', authMiddleware.authorize(['admin', 'moderator']));

// Endpoint para testar fluxo (protegido)
app.post('/api/test-flow', async (req: AuthenticatedRequest, res) => {
  try {
    const { goal, phases } = req.body;

    if (!goal || !phases) {
      throw new ValidationError('Goal e phases são obrigatórios');
    }

    if (!req.user) {
      throw new AuthenticationError();
    }

    // Verificar permissões específicas para execução de fluxos
    if (!req.user.permissions.includes('flow:execute')) {
      throw new AuthorizationError('Permissão insuficiente para executar fluxos');
    }

    // Configurar orquestrador para teste
    const contextStore = new MemoryContextStore();
    const securityAdapter = new SecurityAdapter();

    const config = {
      packs: [{
        id: 'test-pack',
        description: 'Test pack',
        appliesTo: [Phase.Intake, Phase.Implementation],
        buildPrompt: async (goal: string, template: string) => `Prompt for ${goal} with ${template}`
      }],
      validatorStrict: false,
      promptLoader: async (phase: Phase) => `Template for ${phase}`,
      securityFactory: () => securityAdapter,
      contextStore
    };

    const orchestrator = new FlowOrchestrator(config);

    const input = {
      goal,
      contextFiles: [],
      phases: phases.map((p: string) => p as Phase),
      autoDiscoverDocs: false
    };

    const results = await orchestrator.run(input);

    logger.info({
      userId: req.user.id,
      goal,
      phasesCount: phases.length,
      resultsCount: results.length
    }, 'Fluxo executado com sucesso');

    res.json({
      success: true,
      results: results.map(r => ({
        phase: r.phase,
        output: r.output,
        redactionsApplied: r.redactionsApplied
      })),
      executedBy: req.user.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    handleError(error, res);
  }
});

// Endpoint para listar packs disponíveis (protegido)
app.get('/api/packs', (req: AuthenticatedRequest, res) => {
  res.json({
    packs: [
      { id: 'mesa', description: 'Mesa Tech - Discussões colaborativas' },
      { id: 'mcpdevflow', description: 'MCP Dev Flow - Workflow de 10 fases' },
      { id: 'superauditor', description: 'Super Auditor - Validações e segurança' },
      { id: 'codextasks', description: 'Codex Tasks - Geração de tarefas' }
    ],
    requestedBy: req.user?.id,
    timestamp: new Date().toISOString()
  });
});

// Endpoint administrativo para métricas
app.get('/api/admin/metrics', authMiddleware.authorize(['admin']), (req: AuthenticatedRequest, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.1.0-beta',
    authenticatedUsers: 1, // Placeholder
    totalFlows: 0, // Placeholder
    timestamp: new Date().toISOString()
  });
});

// Função centralizada para tratamento de erros
function handleError(error: any, res: Response): void {
  if (error instanceof MCPError) {
    logger.warn({
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    }, 'Erro de aplicação tratado');

    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Erro genérico
  logger.error(error, 'Erro interno não tratado');
  res.status(500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
}

// Middleware de erro global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info({ port: PORT }, 'MCP Fullcycle server iniciado');
});

// Exportar app para testes
export default app;
