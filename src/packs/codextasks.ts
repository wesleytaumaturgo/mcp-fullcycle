import { PromptPack, Phase } from '../types';

/**
 * Pack para Codex Tasks: gera tarefas e prompts para desenvolvimento colaborativo.
 * Cria listas de tarefas baseadas em objetivos e contexto.
 */
export const codexTasksPack: PromptPack = {
  id: 'codextasks',
  description: 'Pack para geração de tarefas e prompts customizados para equipes de desenvolvimento.',
  appliesTo: [Phase.Intake, Phase.Analysis, Phase.Architecture], // Fases de planejamento
  buildPrompt: async (goal: string, template: string): Promise<string> => {
    // Lógica para construir prompt de geração de tarefas
    const tasksPrompt = `
Geração de Tarefas - Codex Tasks
Objetivo: ${goal}

Instruções para geração:
- Quebre o objetivo em tarefas menores e acionáveis.
- Defina responsáveis, prazos e dependências.
- Use templates de tarefas padrão.
- Garanta alinhamento com guidelines de qualidade.

Template de tarefa: ${template}

Gere uma lista estruturada de tarefas para o projeto.
    `.trim();

    // Placeholder: lógica para analisar contexto e gerar tarefas
    return tasksPrompt;
  },
};
