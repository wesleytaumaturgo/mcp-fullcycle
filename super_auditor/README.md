# Super Auditor
Valida arquitetura, testes, segurança e custos.

## Descrição
O Super Auditor é o componente de validação do pacote, responsável por auditar qualidade em arquitetura (SOLID, DDD), testes (TDD >80%), segurança (LGPD, OWASP) e custos (ROI estimado).

## Como Usar
- Execute prompts em `prompts/` durante ou após fases do MCP Dev Flow.
- Use rules em `rules/` para thresholds.
- Integre com ferramentas como JaCoCo para cobertura.

## Como Usar com CI/CD
Integre Super Auditor em pipelines Jenkins/GitHub Actions:
1. Execute scripts de validação após builds.
2. Use thresholds para falhar builds (ex.: cobertura <80%).
3. Gere relatórios automáticos de auditoria.

## Estrutura
- `prompts/`: Prompts para auditorias específicas.
- `rules/`: Regras detalhadas de validação.

Valida arquitetura, testes, segurança e custos.
