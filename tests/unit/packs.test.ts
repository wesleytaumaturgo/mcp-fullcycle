import { mesaPack } from '../../src/packs/mesa';
import { Phase } from '../../src/types';

describe('Mesa Pack', () => {
  describe('mesaPack', () => {
    it('should have correct pack properties', () => {
      expect(mesaPack.id).toBe('mesa');
      expect(mesaPack.description).toContain('Mesa Tech');
      expect(mesaPack.appliesTo).toEqual([Phase.Intake, Phase.Analysis, Phase.Architecture]);
    });

    it('should build prompt correctly', async () => {
      const goal = 'Discutir arquitetura do sistema';
      const template = 'Template de discussão';

      const result = await mesaPack.buildPrompt(goal, template);

      expect(result).toContain(goal);
      expect(result).toContain(template);
      expect(result).toContain('Rodada de Discussão');
      expect(result).toContain('Mesa Tech');
    });

    it('should include discussion structure in prompt', async () => {
      const goal = 'Test goal';
      const template = 'Test template';

      const result = await mesaPack.buildPrompt(goal, template);

      expect(result).toContain('1. Apresente o tópico e convide participantes');
      expect(result).toContain('2. Facilite debate aberto com perguntas guiadas');
      expect(result).toContain('3. Registre pontos-chave e decisões tomadas');
      expect(result).toContain('4. Encerre com ações definidas');
    });
  });
});
