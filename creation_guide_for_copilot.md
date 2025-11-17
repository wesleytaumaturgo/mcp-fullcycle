# Guia de Criação do MCP Fullcycle via GitHub Copilot Agent

## Visão Geral
Crie o projeto MCP Fullcycle, um pacote integrado para desenvolvimento colaborativo guiado por IA, baseado no mcp-fluxo-dev anterior. O projeto deve ser um toolkit reutilizável com componentes modulares: Mesa Tech (discussões em rodadas), MCP Dev Flow (workflow de 10 fases), Super Auditor (validações) e Codex Tasks (geração de tarefas). Use tecnologias como Node.js, TypeScript, Docker, e integrações com IntelliJ (.idea files) e comandos de chat (@mesa-tech, etc.), conforme o mcp-fluxo-dev.

## Tecnologias e Estrutura Baseadas no mcp-fluxo-dev
- **Runtime**: Node.js (baseado no package.json e node_modules do mcp-fluxo-dev).
- **Linguagem**: TypeScript (tsconfig.json presente).
- **Build Tool**: npm/yarn (package.json com scripts).
- **Testes**: Jest (jest.config.ts para testes unitários).
- **Linting**: ESLint (.eslintrc.cjs).
- **Containerização**: Docker e docker-compose (Dockerfile e docker-compose.yml para isolamento, com serviços como PlantUML, SonarQube, JMeter).
- **Integração IDE**: Arquivos .idea para IntelliJ (run configurations, templates, como em setup-intellij.sh).
- **Comandos de Chat**: Scripts shell para comandos como @mesa-tech (setup.sh e mcp-compose.sh).
- **Estrutura de Pastas**: src/ para código (cli/, orchestrator/, packs/, tools/), docs/ para documentação, scripts/ para automação, tools/ para utilitários, prompts_v4/ para prompts organizados.
- **Documentação**: Markdown, JSON para métricas (evaluation_report.json, mcp_excellence_metrics_v2.1.json).
- **CI/CD**: GitHub Actions (.github/workflows).
- **Outros**: Shell scripts para setup, patches (mcp_fix_pack.patch), health server em /healthz.

## Avaliação do Caso de Sucesso mcp-fluxo-dev
O mcp-fluxo-dev é um projeto bem-sucedido com as seguintes lições aprendidas:
- **Pontos Fortes**: Setup automatizado (setup.sh), integração IntelliJ robusta, Docker multi-serviço, CLI rica, validação automática, métricas JSON, health checks.
- **Arquitetura**: Orquestrador de fluxos (FlowOrchestrator), packs especializados (JavaDev), ferramentas modulares (validator, security), context store (file/memory).
- **Scripts npm**: Mais de 20 scripts para setup, testes, Docker, métricas.
- **Docker Services**: PlantUML para diagramas, SonarQube para análise, JMeter para benchmarks, Git tools para regressão.
- **Integração Copilot**: Comandos @mcp-fluxo-dev no chat, com catálogo integrado.
- **Qualidade**: Cobertura 73%, linting rigoroso, type checking.
- **O que Aproveitar**: Estrutura src/ com cli/orchestrator/packs/tools, docker-compose multi-serviço, setup scripts, .idea integration, health server, métricas JSON.

## Passos de Criação Detalhados

### 1. Configurar Projeto Node.js/TypeScript
- Crie um novo projeto Node.js no IntelliJ ou terminal:
  - npm init -y
  - Instale TypeScript: npm install typescript --save-dev
  - Configure tsconfig.json: {"compilerOptions": {"target": "ES2020", "module": "commonjs", "outDir": "./dist", "rootDir": "./src", "strict": true, "esModuleInterop": true}}
  - Instale dependências principais: npm install express, pino (logging), @opentelemetry/api
  - Instale devDependencies: npm install --save-dev @types/node, @types/jest, jest, ts-jest, eslint, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, tsx
- Crie src/ para código fonte, com subpastas: cli/, orchestrator/, packs/, tools/
- Adicione jest.config.ts: {preset: 'ts-jest', testEnvironment: 'node', collectCoverageFrom: ['src/**/*.ts']}
- Adicione .eslintrc.cjs: {extends: ['@typescript-eslint/recommended'], parser: '@typescript-eslint/parser'}

### 2. Estrutura de Diretórios (Baseada em mcp-fluxo-dev)
- Crie pastas em src/:
  - cli/ (interface de linha de comando, como usePrompt.ts)
  - orchestrator/ (FlowOrchestrator, flow.ts)
  - packs/ (packs especializados: mesa.ts, mcpdevflow.ts, superauditor.ts, codextasks.ts)
  - tools/ (utilitários: logger.ts, code_validator.ts, security_adapter.ts, context_store/)
- Adicione scripts/ para automação shell (setup.sh, mcp-compose.sh)
- Crie doc/mcp-fullcycle/ com subpastas detalhadas
- Adicione prompts_v4/ para organização de prompts
- Crie tools/ para scripts adicionais
- Adicione .github/workflows/ para CI/CD

### 3. Implementar Componentes (Inspirado em mcp-fluxo-dev)
- **Mesa Tech**: Módulos em src/packs/mesa.ts para simular rodadas, usando FlowOrchestrator
- **MCP Dev Flow**: Workflow em src/orchestrator/flow.ts com 10 fases, aprovações via arquivos .approved
- **Super Auditor**: Validadores em src/tools/code_validator.ts, security_adapter.ts
- **Codex Tasks**: Geradores em src/cli/usePrompt.ts para prompts de tarefas
- **Health Server**: Em src/index.ts, servidor HTTP em /healthz retornando {"status":"ok"}
- **Context Store**: src/tools/context_store/file.ts e memory.ts para armazenar contexto
- **Logger**: src/tools/logger.ts usando Pino

### 4. Adicionar Docker (Multi-Serviço como mcp-fluxo-dev)
- Crie Dockerfile: FROM node:18, WORKDIR /app, COPY package*.json ./, RUN npm install, COPY . ., RUN npm run build, CMD ["npm", "start"]
- docker-compose.yml com serviços:
  - mcp-fullcycle: app principal (porta 3000, healthcheck)
  - plantuml: para diagramas (porta 8081)
  - sonarqube: análise de código (porta 9000)
  - jmeter: benchmarks
  - git-tools: regressão
- Teste: docker compose up -d, docker compose ps, curl http://localhost:3000/healthz

### 5. Integração IntelliJ (.idea)
- Crie .idea/runConfigurations.xml para "Run MCP Flow", "MCP Planning", "MCP Implementation", "MCP Review"
- Adicione templates.xml para preencher inputs automaticamente
- Configure para executar scripts npm diretamente no IDE
- Adicione external tools para quick actions

### 6. Comandos de Chat e Scripts
- Implemente scripts em scripts/ para comandos @mesa-tech iniciar rodada
- Adicione package.json scripts: "setup", "mcp:up", "mcp:health", "prompt:planning", etc.
- Crie setup.sh para instalação automatizada, verificando Node.js, Docker
- Adicione mcp-compose.sh para comandos Docker

### 7. Documentação Completa
- Preencha README.md com seções como Recursos Principais, Instalação, Primeiro Uso, Comandos
- Adicione docs/ com manual, guia de testes, integração IntelliJ
- Crie templates em docs/templates/ (refer to existing doc/mcp-fullcycle/mcp_dev_flow/templates/ for examples)
- Gere métricas JSON em evaluation_report.json (see doc/mcp-fullcycle/evaluation_report.md for format)

### 8. Testes e Validação
- Adicione testes Jest em tests/
- Configure cobertura >70%
- Adicione linting e typecheck
- Simule fluxos end-to-end

## Detalhes Técnicos do mcp-fluxo-dev para Replicação

### Estrutura de Tipos TypeScript (types.ts)
- **Interfaces Principais**:
  - `FlowInput`: Entrada com goal, contextFiles, phase, autoDiscoverDocs.
  - `FlowResult`: Resultado com phase, template, output, redactionsApplied.
  - `PromptPack`: Packs especializados com id, description, appliesTo, buildPrompt.
  - `FlowConfig`: Configuração com packs, validatorStrict, promptLoader, securityFactory, contextStore.
  - `ContextStore`: Armazenamento de contexto (file/memory) com set/get/purge.
  - `SecurityContext`: Contexto de segurança com scanner DLP, audit sink.
- **Uso**: Defina interfaces similares para MCP Fullcycle, adaptando para Mesa Tech, MCP Dev Flow, etc.

### Orquestrador de Fluxos (flow.ts)
- **FlowOrchestrator**: Classe principal que executa fluxos em fases (planning, implementation, review).
- **Funcionalidades**:
  - Resolução de fases, seleção de packs, carregamento de templates.
  - Construção de contexto a partir de arquivos.
  - Aplicação de hardening de segurança (DLP, redactions).
  - Armazenamento em context store.
  - Validação de código gerado (validateGeneratedCode).
- **Método run**: Processa input, auto-descobre docs, executa por fase.
- **Replicar**: Implemente FlowOrchestrator em src/orchestrator/flow.ts, adaptando para 10 fases do MCP Dev Flow.
  ```typescript
  // Exemplo de implementação básica
  export class FlowOrchestrator {
    constructor(private config: FlowConfig) {}

    async run(input: FlowInput): Promise<FlowResult[]> {
      // Lógica para executar fases
      const results: FlowResult[] = [];
      for (const phase of input.phases) {
        const pack = this.selectPack(phase);
        const result = await pack.buildPrompt(input.goal, template);
        results.push({ phase, output: result });
      }
      return results;
    }
  }
  ```

### Packs Especializados (packs/java.ts)
- **Estrutura**: Cada pack implementa PromptPack com buildPrompt que constrói prompt customizado.
- **Exemplo JavaDev**:
  - Contexto: Spring Boot, Oracle, padrões (Facade, Service).
  - Guidelines: Error handling, logging, design patterns.
  - Quality Gates: Syntax, security, patterns.
  - Validation: Feedback estruturado pós-geração.
- **Replicar**: Crie packs em src/packs/ para mesa.ts (rodadas), mcpdevflow.ts (fases), superauditor.ts (validações), codextasks.ts (tarefas).

### Configuração de Testes (jest.config.ts)
- **Config**: preset 'ts-jest', testEnvironment 'node', collectCoverageFrom 'src/**/*.ts'.
- **Coverage**: thresholds statements 70%, branches/functions 50%.
- **Replicar**: Adicione jest.config.ts idêntico para cobertura >70%.

### Scripts e Setup (setup.sh, package.json)
- **Scripts npm**: 20+ scripts (setup, mcp:up, prompt:planning, etc.).
- **Setup.sh**: Verifica Node.js, Docker, instala dependências, configura .idea.
- **Replicar**: Copie estrutura de scripts, adicione package.json com scripts similares.

### Docker Multi-Serviço
- **Serviços**: mcp-fluxo-dev (app), plantuml (diagramas), sonarqube (análise), jmeter (benchmarks), git-tools (regressão).
- **Healthchecks**: Em cada serviço para garantir disponibilidade.
- **Replicar**: Adicione serviços similares em docker-compose.yml.

### Integração IntelliJ (.idea)
- **Run Configurations**: Para planning, implementation, review.
- **Templates**: Para preenchimento automático.
- **External Tools**: Quick actions.
- **Replicar**: Configure .idea/ com setup-intellij.sh.

### Qualidade e Métricas
- **Cobertura**: 73% statements, 53% branches, 73% functions.
- **Métricas JSON**: evaluation_report.json, mcp_excellence_metrics_v2.1.json.
- **Replicar**: Configure Jest para cobertura alta, gere métricas JSON.

## Instruções Específicas para Copilot Agent
- Use Node.js/TypeScript como core, replicando mcp-fluxo-dev
- Implemente FlowOrchestrator para orquestração
- Adicione packs modulares para cada componente
- Inclua health server e métricas
- Garanta CLI rica com múltiplos comandos
- Documente tudo em Markdown, com exemplos
- Baseie-se na estrutura exata de mcp-fluxo-dev para consistência

## Critérios de Sucesso
- Projeto compila e roda (npm run build && npm start)
- Health check funciona: curl http://localhost:3000/healthz -> {"status":"ok"}
- Docker services sobem corretamente
- Integrações funcionais (IntelliJ, Copilot chat)
- Cobertura de testes >70%
- Pontuação de qualidade >4.5/5

## Validação Final
Após implementar todos os passos, verifique se os arquivos criados correspondem à estrutura existente em doc/mcp-fullcycle/:
- Compare READMEs, templates e prompts com os arquivos em doc/.
- Execute npm run validate para linting e testes.
- Teste health check e Docker services.
- Certifique-se de que a integração IntelliJ funciona conforme esperado.

Execute esses passos sequencialmente para criar o MCP Fullcycle, aproveitando o sucesso do mcp-fluxo-dev.
