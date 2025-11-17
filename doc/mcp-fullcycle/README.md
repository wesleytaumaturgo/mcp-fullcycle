# MCP Fullcycle

O MCP Fullcycle é um toolkit integrado para desenvolvimento colaborativo guiado por IA, composto por componentes modulares: Mesa Tech (discussões em rodadas), MCP Dev Flow (workflow de 10 fases), Super Auditor (validações) e Codex Tasks (geração de tarefas).

## Recursos Principais

- **Mesa Tech**: Facilita discussões colaborativas em rodadas para tomada de decisões.
- **MCP Dev Flow**: Workflow estruturado com 10 fases de desenvolvimento, de Intake a Closure.
- **Super Auditor**: Validações automáticas de código, segurança e qualidade.
- **Codex Tasks**: Geração inteligente de tarefas baseadas em objetivos e contexto.
- **Integração IntelliJ**: Configurações prontas para desenvolvimento no IDE.
- **Docker Multi-Serviço**: Ambiente containerizado com PlantUML, SonarQube, JMeter e Git Tools.
- **Health Server**: Endpoint /healthz para monitoramento de disponibilidade.

## Instalação

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- IntelliJ IDEA (opcional, mas recomendado)

### Passos
1. Clone o repositório:
   ```bash
   git clone <repo-url>
   cd mcp-fullcycle
   ```

2. Execute o setup automatizado:
   ```bash
   ./setup.sh
   ```

3. Inicie os serviços Docker:
   ```bash
   npm run mcp:up
   ```

## Primeiro Uso

1. Verifique a saúde do sistema:
   ```bash
   npm run mcp:health
   ```

2. Execute um fluxo de desenvolvimento:
   ```bash
   npm run flow:intake
   ```

3. Use comandos de chat:
   ```bash
   npm run chat:mesa --goal="discutir arquitetura"
   ```

## Comandos

### Setup e Build
- `npm run setup`: Configuração inicial
- `npm run build`: Compilar TypeScript
- `npm run dev`: Executar em modo desenvolvimento
- `npm run start`: Executar produção

### Docker
- `npm run mcp:up`: Iniciar serviços
- `npm run mcp:down`: Parar serviços
- `npm run mcp:health`: Verificar saúde
- `npm run mcp:logs`: Ver logs

### Fluxos
- `npm run flow:intake`: Fase Intake
- `npm run flow:analysis`: Fase Analysis
- ... (até `flow:closure`)

### Ferramentas
- `npm run mesa:run`: Executar Mesa Tech
- `npm run auditor:check`: Executar Super Auditor
- `npm run codex:generate`: Gerar tarefas

### Chat
- `npm run chat:mesa`: @mesa-tech
- `npm run chat:mcp`: @mcp
- `npm run chat:auditor`: @super-auditor
- `npm run chat:codex`: @codex-tasks

## Estrutura do Projeto

```
src/
??? cli/
??? orchestrator/
?   ??? flow.ts
??? packs/
?   ??? mesa.ts
?   ??? mcpdevflow.ts
?   ??? superauditor.ts
?   ??? codextasks.ts
??? tools/
?   ??? logger.ts
?   ??? code_validator.ts
?   ??? security_adapter.ts
?   ??? context_store/
?       ??? memory.ts
?       ??? file.ts
??? types.ts
??? index.ts

doc/mcp-fullcycle/
??? README.md
??? templates/
??? prompts/
??? workflows/
??? approvals/
??? policies/

Dockerfile
docker-compose.yml
```

## Contribuição

1. Siga o workflow MCP Dev Flow.
2. Use os packs para prompts consistentes.
3. Execute validações com Super Auditor.
4. Documente mudanças em docs/.

## Licença

ISC
