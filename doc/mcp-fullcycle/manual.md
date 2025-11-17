# Manual do Usuário - MCP Fullcycle

## Visão Geral
O MCP Fullcycle é uma suíte de ferramentas para desenvolvimento colaborativo guiado por IA. Este manual cobre o uso diário dos componentes principais.

## Componentes

### Mesa Tech
- **Propósito**: Facilitar discussões colaborativas.
- **Como usar**:
  1. Execute `npm run mesa:run`
  2. Forneça objetivo e contexto
  3. Participe da rodada de discussão

### MCP Dev Flow
- **Propósito**: Executar workflows de desenvolvimento em 10 fases.
- **Como usar**:
  1. Escolha uma fase: `npm run flow:<fase>`
  2. Monitore progresso via logs
  3. Aprove via arquivos .approved

### Super Auditor
- **Propósito**: Validar código e segurança.
- **Como usar**:
  1. Execute `npm run auditor:check`
  2. Revise relatórios gerados
  3. Corrija issues identificadas

### Codex Tasks
- **Propósito**: Gerar tarefas automaticamente.
- **Como usar**:
  1. Execute `npm run codex:generate`
  2. Revise tarefas sugeridas
  3. Integre ao workflow

## Troubleshooting
- **Erro de build**: Execute `npm run clean` e `npm run build`
- **Serviços Docker**: Use `./mcp-compose.sh health`
- **Logs**: `npm run mcp:logs`

## Suporte
Para suporte, consulte a documentação em docs/ ou abra uma issue no repositório.
