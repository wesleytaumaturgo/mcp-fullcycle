# Integração IntelliJ - MCP Fullcycle

## Configurações IDE
O projeto inclui configurações prontas para IntelliJ IDEA.

## Run Configurations
- **Run MCP Flow**: Executa o servidor principal
- **MCP Planning**: Executa com foco em planning
- **MCP Implementation**: Foco em implementação
- **MCP Review**: Foco em review

Acesse: Run > Run... > Selecionar configuração

## External Tools
- **MCP Build**: `npm run build`
- **MCP Health Check**: Verifica /healthz
- **MCP Docker Up**: `docker-compose up -d`
- **MCP Docker Down**: `docker-compose down`

Acesse: Tools > External Tools

## File Templates
- **MCP Flow Input**: Template JSON para entradas
- **MCP Pack Template**: Template TS para packs

Acesse: File > New > Selecionar template

## Debugging
1. Configure breakpoints em src/
2. Execute via Run Configurations
3. Use debugger integrado

## Hot Reload
- Use `npm run dev` para desenvolvimento
- Alterações refletidas automaticamente

## Integração Git
- Commits seguem convenções
- PRs usam templates em templates/pr_template.md
