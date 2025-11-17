# MCP Dev Flow
Workflow MCP com 10 fases e aprovação por .approved ou comando APROVADO FASE X.

## Descrição
O MCP Dev Flow é o componente de workflow incremental do pacote, estruturado em 10 fases sequenciais para guiar o desenvolvimento de software desde o intake até o handover. Cada fase inclui aprovações obrigatórias para garantir governança e qualidade, evitando avanços sem validação.

## Fases do Workflow
1. **Intake**: Coleta de requisitos iniciais.
2. **Análise**: Análise de viabilidade e riscos.
3. **Arquitetura**: Definição de arquitetura e design.
4. **Implementação**: Desenvolvimento do código.
5. **Testes**: Execução de testes unitários e integração.
6. **Segurança**: Validação de aspectos de segurança.
7. **Custos**: Análise de custos e ROI.
8. **Go/No-Go**: Decisão final de prosseguir.
9. **Handover**: Preparação para entrega.
10. **Closure**: Finalização e documentação.

## Como Usar
- Inicie a Fase 1 preenchendo templates em `templates/`.
- Execute atividades da fase usando prompts em `prompts/`.
- Aprove via arquivo `.approved` em `approvals/` ou comando "APROVADO FASE X".
- Políticas em `policies/` devem ser seguidas.

## Estrutura
- `approvals/`: Arquivos de aprovação por fase.
- `policies/`: Políticas de governança.
- `prompts/`: Prompts para cada fase.
- `templates/`: Templates para documentos e checklists.
- `workflows/`: Arquivo YAML do workflow completo.

## Diagrama de Fluxo
```
[Preparação] -> [Fase 1: Intake] -> [Fase 2: Análise] -> [Fase 3: Arquitetura]
     |              |              |              |
     v              v              v              v
[Aprovação] -> [Fase 4: Implementação] -> [Fase 5: Testes] -> [Fase 6: Segurança]
     |              |              |              |
     v              v              v              v
[Aprovação] -> [Fase 7: Custos] -> [Fase 8: Go/No-Go] -> [Fase 9: Handover]
     |              |              |              |
     v              v              v              v
[Aprovação] -> [Fase 10: Closure] -> [Finalização]
```

Workflow MCP com 10 fases e aprovação por .approved ou comando APROVADO FASE X.
