import { PromptPack, Phase } from '../types';

/**
 * Pack para MCP Dev Flow: gerencia o workflow de 10 fases de desenvolvimento.
 * Fornece prompts estruturados para cada fase do processo.
 */
export const mcpDevFlowPack: PromptPack = {
  id: 'mcpdevflow',
  description: 'Pack para orquestrar o fluxo de desenvolvimento com 10 fases, incluindo aprovações e validações.',
  appliesTo: Object.values(Phase), // Aplica-se a todas as fases
  buildPrompt: async (goal: string, template: string): Promise<string> => {
    // Lógica para construir prompt baseado na fase atual
    // Assumindo que template contém informações da fase
    const phasePrompts: Record<Phase, string> = {
      [Phase.Intake]: 'Colete requisitos iniciais e valide viabilidade.',
      [Phase.Analysis]: 'Analise riscos, dependências e arquitetura proposta.',
      [Phase.Architecture]: 'Defina arquitetura detalhada e padrões.',
      [Phase.Implementation]: 'Implemente código seguindo guidelines.',
      [Phase.Tests]: 'Desenvolva e execute testes abrangentes.',
      [Phase.Security]: 'Realize auditorias de segurança e hardening.',
      [Phase.Costs]: 'Avalie custos e otimizações.',
      [Phase.GoNoGo]: 'Decida se prossegue ou aborta.',
      [Phase.Handover]: 'Prepare documentação e transferência.',
      [Phase.Closure]: 'Finalize projeto e lições aprendidas.',
    };

    // Placeholder: detectar fase do template ou contexto
    const currentPhase = Phase.Intake; // Exemplo, implementar lógica para detectar

    const prompt = `
Workflow MCP Dev Flow - Fase: ${currentPhase}
Objetivo: ${goal}

Instruções para esta fase:
${phasePrompts[currentPhase]}

Template: ${template}

Gere um prompt executável para avançar nesta fase.
    `.trim();

    return prompt;
  },
};
