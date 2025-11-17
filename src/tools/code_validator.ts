import { logger } from './logger';

/**
 * Validador de código para o MCP Fullcycle.
 * Realiza validações básicas de sintaxe, padrões e qualidade.
 */
export class CodeValidator {
  /**
   * Valida código TypeScript/JavaScript básico.
   * @param code Código a ser validado.
   * @returns Resultado da validação com erros encontrados.
   */
  async validateCode(code: string): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Validação básica de sintaxe
      if (!code.trim()) {
        errors.push('Código vazio');
      }

      // Verificar chaves balanceadas
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push('Chaves desbalanceadas');
      }

      // Verificar uso de console.log (exemplo de padrão)
      if (code.includes('console.log') && !code.includes('// TODO')) {
        errors.push('Uso de console.log detectado, considere usar logger');
      }

      // Placeholder: integrar com ESLint ou TypeScript compiler para validações avançadas
      logger.info({ codeLength: code.length }, 'Validação de código executada');

    } catch (error) {
      logger.error(error as Error, 'Erro durante validação de código');
      errors.push('Erro interno na validação');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida padrões de qualidade (ex.: cobertura de testes).
   * @param metrics Métricas do código.
   * @returns Se atende aos padrões.
   */
  validateQuality(metrics: { coverage?: number; lines?: number }): boolean {
    const minCoverage = 70;
    const maxLines = 1000;

    if (metrics.coverage !== undefined && metrics.coverage < minCoverage) {
      logger.warn({ coverage: metrics.coverage }, 'Cobertura de testes abaixo do mínimo');
      return false;
    }

    if (metrics.lines !== undefined && metrics.lines > maxLines) {
      logger.warn({ lines: metrics.lines }, 'Arquivo muito longo');
      return false;
    }

    return true;
  }
}
