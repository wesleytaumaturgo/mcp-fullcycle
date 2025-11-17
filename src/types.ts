/**
 * Tipos e interfaces TypeScript para o projeto MCP Fullcycle.
 * Essas defini??es s?o baseadas na estrutura do mcp-fluxo-dev e adaptadas para os componentes do MCP Fullcycle.
 */

/**
 * Enum representando as fases do fluxo de desenvolvimento MCP.
 */
export enum Phase {
  Intake = 'intake',
  Analysis = 'analysis',
  Architecture = 'architecture',
  Implementation = 'implementation',
  Tests = 'tests',
  Security = 'security',
  Costs = 'costs',
  GoNoGo = 'go_no_go',
  Handover = 'handover',
  Closure = 'closure',
}

/**
 * Interface para a entrada do orquestrador de fluxo.
 * Cont?m o objetivo, arquivos de contexto, fases a executar e flag de auto-descoberta.
 */
export interface FlowInput {
  goal: string;
  contextFiles: string[];
  phases: Phase[];
  autoDiscoverDocs: boolean;
}

/**
 * Interface para o resultado da execu??o de uma fase do fluxo.
 * Inclui a fase, template usado, sa?da gerada e reda??es aplicadas.
 */
export interface FlowResult {
  phase: Phase;
  template: string;
  output: string;
  redactionsApplied: boolean;
}

/**
 * Interface para packs de prompt especializados.
 * Cada pack tem um ID, descri??o, crit?rios appliesTo e m?todo buildPrompt.
 */
export interface PromptPack {
  id: string;
  description: string;
  appliesTo: string[];
  buildPrompt: (goal: string, template: string) => Promise<string>;
}

/**
 * Interface para configura??o do fluxo.
 * Inclui packs, rigor de valida??o, carregador de prompts, f?brica de seguran?a e armazenamento de contexto.
 */
export interface FlowConfig {
  packs: PromptPack[];
  validatorStrict: boolean;
  promptLoader: (phase: Phase) => Promise<string>;
  securityFactory: () => SecurityContext;
  contextStore: ContextStore;
}

/**
 * Interface para armazenamento de contexto.
 * Suporta armazenamento em arquivo e mem?ria com opera??es set, get e purge.
 */
export interface ContextStore {
  set: (key: string, value: any) => Promise<void>;
  get: (key: string) => Promise<any>;
  purge: (key: string) => Promise<void>;
}

/**
 * Interface para contexto de seguran?a.
 * Inclui scanner DLP e sink de auditoria para valida??es de seguran?a.
 */
export interface SecurityContext {
  dlpScanner: (content: string) => Promise<boolean>;
  auditSink: (event: string) => Promise<void>;
}
