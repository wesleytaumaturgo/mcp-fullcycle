import { PromptPack, Phase } from '../types';

/**
 * Pack para Mesa Tech: simula discussões em rodadas colaborativas.
 * Gera prompts para sessões de brainstorming e tomada de decisões em grupo.
 */
export const mesaPack: PromptPack = {
  id: 'mesa',
  description: 'Pack especializado para discussões em rodadas da Mesa Tech, facilitando colaborações e decisões coletivas.',
  appliesTo: [Phase.Intake, Phase.Analysis, Phase.Architecture], // Aplica-se a fases iniciais para discussões
  buildPrompt: async (goal: string, template: string): Promise<string> => {
    // Lógica para construir prompt de discussão em rodadas
    const basePrompt = `
Rodada de Discussão - Mesa Tech
Objetivo: ${goal}

Instruções para a rodada:
1. Apresente o tópico e convide participantes.
2. Facilite debate aberto com perguntas guiadas.
3. Registre pontos-chave e decisões tomadas.
4. Encerre com ações definidas.

Template base: ${template}

Gere um prompt detalhado para moderar a discussão.
    `.trim();

    // Placeholder: adicionar lógica personalizada baseada em contexto
    return basePrompt;
  },
};
