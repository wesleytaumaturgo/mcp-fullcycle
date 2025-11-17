import pino from 'pino';

/**
 * Logger centralizado usando Pino para o projeto MCP Fullcycle.
 * Fornece logging estruturado para debug, info, warn e error.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

/**
 * Função utilitária para logging de erros com contexto adicional.
 */
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error({ error: error.message, stack: error.stack, ...context }, 'Erro ocorrido');
};
