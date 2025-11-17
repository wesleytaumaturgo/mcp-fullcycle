import { FlowInput, FlowResult, FlowConfig, Phase, PromptPack } from '../types';
import pino from 'pino';

const logger = pino();

/**
 * Classe FlowOrchestrator para executar fluxos de desenvolvimento em fases.
 * Trata resolução de fases, seleção de packs, carregamento de templates, construção de contexto, aplicação de hardening de segurança e validação.
 */
export class FlowOrchestrator {
  private logger = pino();

  constructor(private config: FlowConfig) {}

  /**
   * Executa o fluxo baseado na entrada, processando cada fase.
   * @param input A entrada do fluxo contendo objetivo, fases, arquivos de contexto e flag de auto-descoberta.
   * @returns Array de resultados do fluxo para cada fase.
   */
  async run(input: FlowInput): Promise<FlowResult[]> {
    try {
      this.logger.info({ goal: input.goal, phases: input.phases }, 'Iniciando execução do fluxo');

      const results: FlowResult[] = [];

      for (const phase of input.phases) {
        this.logger.info({ phase }, 'Processando fase');

        const pack = this.selectPack(phase);
        if (!pack) {
          throw new Error(`Nenhum pack encontrado para a fase: ${phase}`);
        }

        const template = await this.config.promptLoader(phase); // Assumindo que o template é a string da fase para simplicidade
        const contextFragment = await this.buildContextFragment(input.contextFiles, input.autoDiscoverDocs);
        const prompt = await pack.buildPrompt(input.goal, template + contextFragment);

        // Aplicar hardening de segurança
        const securityContext = this.config.securityFactory();
        const isSecure = await securityContext.dlpScanner(prompt);
        if (!isSecure) {
          await securityContext.auditSink(`Violação DLP no prompt para a fase ${phase}`);
          throw new Error(`Violação de segurança na fase ${phase}`);
        }

        // Armazenar contexto
        await this.config.contextStore.set(`phase_${phase}`, prompt);

        const output = await this.compileOutput(prompt, phase);

        results.push({
          phase,
          template,
          output,
          redactionsApplied: !isSecure, // Assumindo redações se não seguro, mas lógica pode variar
        });

        this.logger.info({ phase }, 'Fase concluída com sucesso');
      }

      this.logger.info({ resultsCount: results.length }, 'Execução do fluxo concluída');
      return results;
    } catch (error) {
      this.logger.error(error as Error, 'Erro na execução do fluxo');
      throw error;
    }
  }

  /**
   * Seleciona o pack de prompt apropriado para a fase dada.
   * @param phase A fase para selecionar um pack.
   * @returns O PromptPack selecionado ou null se nenhum encontrado.
   */
  private selectPack(phase: Phase): PromptPack | null {
    // Lógica simples de seleção: encontrar pack que se aplica à fase
    return this.config.packs.find(pack => pack.appliesTo.includes(phase)) || null;
  }

  /**
   * Constrói um fragmento de contexto a partir dos arquivos de contexto e auto-descoberta.
   * @param contextFiles Array de caminhos de arquivos.
   * @param autoDiscoverDocs Flag para auto-descoberta.
   * @returns A string do fragmento de contexto construído.
   */
  private async buildContextFragment(contextFiles: string[], autoDiscoverDocs: boolean): Promise<string> {
    // Placeholder: ler arquivos e construir contexto
    // Na implementação real, ler arquivos de contextFiles
    let fragment = '';
    for (const file of contextFiles) {
      // Simular leitura de arquivo
      fragment += `Conteúdo de ${file}\n`;
    }
    if (autoDiscoverDocs) {
      fragment += 'Documentos auto-descobertos\n';
    }
    return fragment;
  }

  /**
   * Compila a saída final a partir do prompt e da fase.
   * @param prompt O prompt construído.
   * @param phase A fase atual.
   * @returns A string da saída compilada.
   */
  private async compileOutput(prompt: string, phase: Phase): Promise<string> {
    // Placeholder: processar prompt para gerar saída
    // Na implementação real, pode envolver geração de IA ou outra lógica
    return `Saída compilada para ${phase}: ${prompt}`;
  }
}
