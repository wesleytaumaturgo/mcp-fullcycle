# Guia de Interação no Chat com GitHub Copilot para Criar MCP Fullcycle

## Introdução
Este guia fornece instruções passo-a-passo sobre como interagir comigo (GitHub Copilot Agent) no chat do IntelliJ IDEA para criar o projeto MCP Fullcycle do zero. O projeto será baseado na estrutura existente em `/home/wesley/MBA/repository/mcp-fullcycle`, que contém a documentação completa. Cada etapa inclui mensagens prontas para copiar e colar no chat, com explicações detalhadas.

**Pré-requisitos**:
- IntelliJ IDEA com GitHub Copilot habilitado.
- Acesso ao repositório BS-vbnet-poupador-calcula-economia-master.
- Conhecimento básico de Node.js/TypeScript (eu ajudarei com detalhes).
- Links para Tutoriais: [Node.js Docs](https://nodejs.org/docs/), [TypeScript Handbook](https://www.typescriptlang.org/docs/), [Jest Testing](https://jestjs.io/docs/getting-started).

**Objetivo**: Criar um projeto Node.js/TypeScript funcional com MCP Fullcycle, replicando o sucesso de mcp-fluxo-dev.

## Etapa 1: Iniciar o Projeto e Setup Inicial
**Objetivo**: Configurar o projeto Node.js/TypeScript básico.

**Mensagem para o Chat**:
```
Iniciar criação do projeto MCP Fullcycle. Baseie-se no guia em /home/wesley/MBA/repository/mcp-fullcycle/creation_guide_for_copilot.md. Comece criando um novo projeto Node.js/TypeScript no IntelliJ: npm init -y, instale TypeScript, configure tsconfig.json, jest.config.ts, .eslintrc.cjs, e crie estrutura src/ com subpastas cli/, orchestrator/, packs/, tools/. Instale dependências: express, pino, jest, eslint, tsx.
```

**O que Esperar**: Eu gerarei comandos para criar o projeto, instalar deps e configurar arquivos. Execute-os no terminal.

**Exemplos de Respostas Esperadas**:
- "Execute estes comandos no terminal: `npm init -y`, `npm install typescript --save-dev`, etc. Em seguida, crie tsconfig.json com {...}."

## Etapa 2: Implementar Tipos e Interfaces TypeScript
**Objetivo**: Definir tipos TS conforme mcp-fluxo-dev.

**Mensagem para o Chat**:
```
Agora implemente os tipos TypeScript em src/types.ts. Use as interfaces do guia: FlowInput, FlowResult, PromptPack, FlowConfig, ContextStore, SecurityContext. Inclua enums para Phase (planning, implementation, review). Adicione comentários explicativos.
```

**O que Esperar**: Código para src/types.ts com interfaces detalhadas.

## Etapa 3: Criar FlowOrchestrator
**Objetivo**: Implementar o orquestrador principal.

**Mensagem para o Chat**:
```
Implemente FlowOrchestrator em src/orchestrator/flow.ts. Classe com constructor, método run() que processa FlowInput, seleciona packs, aplica validações. Use o exemplo de código do guia: classe com selectPack, buildContextFragment, compileOutput. Inclua tratamento de erros e logging com Pino.
```

**O que Esperar**: Código completo para o orquestrador, com métodos auxiliares.

**Exemplos de Respostas Esperadas**:
- Código TypeScript para FlowOrchestrator, como: `export class FlowOrchestrator { constructor(private config: FlowConfig) {} async run(input: FlowInput): Promise<FlowResult[]> { ... } }`

## Etapa 4: Desenvolver Packs Especializados
**Objetivo**: Criar packs para Mesa Tech, MCP Dev Flow, etc.

**Mensagem para o Chat**:
```
Crie packs em src/packs/. Para mesa.ts: PromptPack para rodadas, com buildPrompt() que gera prompts para discussões. Para mcpdevflow.ts: Pack para workflow de 10 fases. Para superauditor.ts: Pack para validações. Para codextasks.ts: Pack para geração de tarefas. Use estrutura similar ao JavaDev do mcp-fluxo-dev.
```

**O que Esperar**: Arquivos TS para cada pack, com lógica de buildPrompt.

## Etapa 5: Adicionar Tools e Utilitários
**Objetivo**: Implementar ferramentas auxiliares.

**Mensagem para o Chat**:
```
Implemente tools em src/tools/: logger.ts com Pino, code_validator.ts para validações, security_adapter.ts para DLP, context_store/ com file.ts e memory.ts. Inclua health server em src/index.ts com endpoint /healthz retornando {"status":"ok"}.
```

**O que Esperar**: Módulos utilitários e servidor de health.

## Etapa 6: Configurar Docker Multi-Serviço
**Objetivo**: Adicionar containerização.

**Mensagem para o Chat**:
```
Crie Dockerfile e docker-compose.yml. Dockerfile: FROM node:18, WORKDIR /app, COPY package*.json, RUN npm install, COPY ., RUN npm run build, CMD npm start. docker-compose.yml com serviços: mcp-fullcycle (porta 3000), plantuml (8081), sonarqube (9000), jmeter, git-tools. Inclua healthchecks.
```

**O que Esperar**: Arquivos Docker prontos para multi-serviço.

**Exemplos de Respostas Esperadas**:
- Conteúdo para docker-compose.yml: `version: '3.8' services: mcp-fullcycle: build: . ports: - "3000:3000" ...`

## Etapa 7: Integração com IntelliJ
**Objetivo**: Configurar .idea para IDE.

**Mensagem para o Chat**:
```
Configure integração IntelliJ: .idea/runConfigurations.xml para "Run MCP Flow", "MCP Planning", etc. Adicione templates.xml para preenchimento automático. Crie external tools para quick actions. Baseie em setup-intellij.sh do mcp-fluxo-dev.
```

**O que Esperar**: Arquivos .idea configurados.

## Etapa 8: Scripts e Comandos de Chat
**Objetivo**: Adicionar automação.

**Mensagem para o Chat**:
```
Adicione scripts: package.json com 20+ scripts (setup, mcp:up, prompt:planning, etc.). Crie setup.sh para instalação automatizada, verificando Node.js/Docker. Adicione mcp-compose.sh para comandos Docker. Suporte a @mesa-tech no chat.
```

**O que Esperar**: Scripts shell e package.json completo.

## Etapa 9: Documentação e Preenchimento
**Objetivo**: Completar docs.

**Mensagem para o Chat**:
```
Preencha doc/mcp-fullcycle/ com READMEs, templates, prompts. Use referências do guia: para templates/ refer to existing doc/mcp-fullcycle/mcp_dev_flow/templates/. Gere métricas JSON em evaluation_report.json.
```

**O que Esperar**: Documentação completa alinhada com estrutura existente.

## Etapa 10: Testes e Validação
**Objetivo**: Adicionar testes e validar.

**Mensagem para o Chat**:
```
Adicione testes Jest em tests/: unitários para classes, integração para flows. Configure cobertura >70%. Adicione linting. Valide: npm run build, health check, Docker up, IntelliJ integration.
```

**O que Esperar**: Testes passando, cobertura alta, validações OK.

## Etapa 11: Validação Final e Deploy
**Objetivo**: Finalizar e testar end-to-end.

**Mensagem para o Chat**:
```
Execute validação final: compare arquivos com doc/mcp-fullcycle/, npm run validate, teste health/Docker/IntelliJ. Verifique critérios: compilação, health OK, cobertura >70%, qualidade >4.5/5. Prepare para deploy.
```

**O que Esperar**: Confirmação de sucesso, projeto pronto.

## Dicas Gerais
- **Copie e Cole**: Use as mensagens exatas fornecidas.
- **Execute Passo a Passo**: Aguarde resposta antes de prosseguir.
- **Verifique Erros**: Se houver issues, reporte para ajustes.
- **Tempo Estimado**: 10-15h, conforme guia.
- **Suporte**: Eu guiarei com código e explicações.

## Tratamento de Erros Comuns
- **Erro de Dependências**: "npm install falhou" ? Verifique Node.js versão (18+), delete node_modules e tente novamente.
- **Docker Não Sobe**: "docker compose up falhou" ? Certifique-se de que portas 3000, 8081, etc., estão livres. Use `docker compose logs` para debug.
- **Testes Falham**: "Jest erro" ? Verifique jest.config.ts, execute `npm run test:watch` para debug interativo.
- **IntelliJ Não Reconhece**: ".idea erro" ? Restart IntelliJ, verifique se Copilot está habilitado.
- **Build Falha**: "tsc erro" ? Corrija tipos em src/types.ts, use `npm run typecheck`.

Este guia garante criação completa do MCP Fullcycle via chat interativo.
