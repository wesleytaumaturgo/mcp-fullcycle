# Mesa Tech – MCP Dev
Use com o GPT da mesa para discussão em rodadas.

## Descrição
O Mesa Tech é o componente de discussões estruturadas do pacote, simulando mesas redondas com especialistas virtuais (Arquiteto, Backend, Dados, etc.) para gerar consensos e blueprints antes da implementação.

## Como Usar
1. Preencha um template em `inputs/` com contexto do projeto.
2. Inicie rodadas via GPT Mesa Tech: Rodada 1 (argumentos), 2 (contra-argumentos), 3 (consenso).
3. Use outputs para alimentar o MCP Dev Flow.

## Tutorial Passo-a-Passo
1. Preencha um template em `inputs/`.
2. Inicie rodada 1 no Copilot: "Rodada 1: Argumentos".
3. Discuta com IA, refine.
4. Prossiga para rodadas 2 e 3.
5. Use output para MCP Dev Flow.

## Estrutura
- `inputs/`: Templates de entrada (ex.: context_solution_existing_template.md).
- `mesa_prompts/`: Prompts para rodadas e modos adicionais.

Use com o GPT da mesa para discussão em rodadas.
