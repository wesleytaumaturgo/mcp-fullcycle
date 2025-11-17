# Guia de Testes - MCP Fullcycle

## Estratégia de Testes
O projeto utiliza Jest para testes unitários, com foco em cobertura >70%.

## Executando Testes
```bash
npm test              # Executar todos os testes
npm run test -- --watch  # Modo watch
```

## Estrutura de Testes
```
tests/
??? unit/
?   ??? orchestrator.test.ts
?   ??? packs.test.ts
?   ??? tools.test.ts
??? integration/
?   ??? flow.test.ts
??? e2e/
    ??? docker.test.ts
```

## Cobertura
- **Statements**: 73%
- **Branches**: 53%
- **Functions**: 73%
- **Lines**: 73%

## Testes por Componente

### FlowOrchestrator
- Testa execução de fases
- Valida seleção de packs
- Verifica tratamento de erros

### Packs
- Testa buildPrompt para cada pack
- Valida appliesTo
- Simula cenários de uso

### Tools
- Logger: Testa níveis de log
- CodeValidator: Testa validações
- SecurityAdapter: Testa DLP
- ContextStore: Testa persistência

## Testes E2E
- Verifica health endpoint
- Testa Docker services
- Valida integrações

## CI/CD
Testes executados automaticamente via GitHub Actions em push/PR.
