import { FlowOrchestrator } from '../../src/orchestrator/flow';
import { FlowInput, FlowResult, Phase } from '../../src/types';

describe('FlowOrchestrator', () => {
  let orchestrator: FlowOrchestrator;
  let mockConfig: any;

  beforeEach(() => {
    mockConfig = {
      packs: [],
      validatorStrict: false,
      promptLoader: jest.fn().mockResolvedValue('template'),
      securityFactory: jest.fn().mockReturnValue({
        dlpScanner: jest.fn().mockResolvedValue(true),
        auditSink: jest.fn().mockResolvedValue(undefined)
      }),
      contextStore: {
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(undefined),
        purge: jest.fn().mockResolvedValue(undefined)
      }
    };
    orchestrator = new FlowOrchestrator(mockConfig);
  });

  describe('run', () => {
    it('should execute flow successfully', async () => {
      const input: FlowInput = {
        goal: 'Test goal',
        contextFiles: ['file1.ts'],
        phases: [Phase.Intake],
        autoDiscoverDocs: false
      };

      const mockPack = {
        id: 'test',
        description: 'Test pack',
        appliesTo: [Phase.Intake],
        buildPrompt: jest.fn().mockResolvedValue('prompt')
      };

      mockConfig.packs = [mockPack];

      const results = await orchestrator.run(input);

      expect(results).toHaveLength(1);
      expect(results[0].phase).toBe(Phase.Intake);
      expect(mockConfig.promptLoader).toHaveBeenCalledWith(Phase.Intake);
      expect(mockPack.buildPrompt).toHaveBeenCalled();
    });

    it('should throw error if no pack found', async () => {
      const input: FlowInput = {
        goal: 'Test goal',
        contextFiles: [],
        phases: [Phase.Intake],
        autoDiscoverDocs: false
      };

      mockConfig.packs = [];

      await expect(orchestrator.run(input)).rejects.toThrow('Nenhum pack encontrado');
    });

    it('should handle security violation', async () => {
      const input: FlowInput = {
        goal: 'Test goal',
        contextFiles: [],
        phases: [Phase.Intake],
        autoDiscoverDocs: false
      };

      const mockPack = {
        id: 'test',
        description: 'Test pack',
        appliesTo: [Phase.Intake],
        buildPrompt: jest.fn().mockResolvedValue('prompt with secret')
      };

      mockConfig.packs = [mockPack];
      mockConfig.securityFactory().dlpScanner.mockResolvedValue(false);

      try {
        await orchestrator.run(input);
        throw new Error('Expected security violation error to be thrown');
      } catch (error) {
        if ((error as Error).message === 'Expected security violation error to be thrown') {
          throw error; // Re-throw se for o erro inesperado
        }
        // Se chegou aqui, é o erro esperado
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Viola');
        expect((error as Error).message).toContain('segurança');
      }
    });
  });

  describe('selectPack', () => {
    it('should select correct pack', () => {
      const mockPack = {
        id: 'test',
        description: 'Test pack',
        appliesTo: [Phase.Intake],
        buildPrompt: jest.fn()
      };

      mockConfig.packs = [mockPack];

      const result = (orchestrator as any).selectPack(Phase.Intake);

      expect(result).toBe(mockPack);
    });

    it('should return null if no pack applies', () => {
      mockConfig.packs = [];

      const result = (orchestrator as any).selectPack(Phase.Intake);

      expect(result).toBeNull();
    });
  });
});
