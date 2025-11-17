import { FlowOrchestrator } from '../../src/orchestrator/flow';
import { FlowInput, Phase } from '../../src/types';
import { MemoryContextStore } from '../../src/tools/context_store';
import { SecurityAdapter } from '../../src/tools/security_adapter';

describe('Flow Integration', () => {
  let orchestrator: FlowOrchestrator;
  let contextStore: MemoryContextStore;
  let securityAdapter: SecurityAdapter;

  beforeEach(() => {
    contextStore = new MemoryContextStore();
    securityAdapter = new SecurityAdapter();

    const config = {
      packs: [{
        id: 'test-pack',
        description: 'Test pack',
        appliesTo: [Phase.Intake, Phase.Implementation],
        buildPrompt: async (goal: string, template: string) => `Prompt for ${goal} with ${template}`
      }],
      validatorStrict: false,
      promptLoader: async (template: string) => `Template for ${template}`,
      securityFactory: () => securityAdapter,
      contextStore
    };

    orchestrator = new FlowOrchestrator(config);
  });

  it('should execute full flow with multiple phases', async () => {
    const input: FlowInput = {
      goal: 'Build a web app',
      contextFiles: ['src/index.ts'],
      phases: [Phase.Intake, Phase.Implementation],
      autoDiscoverDocs: true
    };

    const results = await orchestrator.run(input);

    expect(results).toHaveLength(2);
    expect(results[0].phase).toBe(Phase.Intake);
    expect(results[1].phase).toBe(Phase.Implementation);
    expect(results[0].output).toContain('Build a web app');
    expect(results[1].output).toContain('Build a web app');
  });

  it('should store context for each phase', async () => {
    const input: FlowInput = {
      goal: 'Test context storage',
      contextFiles: [],
      phases: [Phase.Intake],
      autoDiscoverDocs: false
    };

    await orchestrator.run(input);

    const stored = await contextStore.get('phase_intake');
    expect(stored).toBeDefined();
  });

  it('should handle context fragment building', async () => {
    const input: FlowInput = {
      goal: 'Test context',
      contextFiles: ['file1.ts', 'file2.ts'],
      phases: [Phase.Intake],
      autoDiscoverDocs: true
    };

    await orchestrator.run(input);

    // Verify context was processed (mock implementation returns fragment)
    const stored = await contextStore.get('phase_intake');
    expect(stored).toContain('file1.ts');
    expect(stored).toContain('file2.ts');
  });
});
