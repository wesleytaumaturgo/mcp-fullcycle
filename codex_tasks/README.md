# Codex Tasks
Gera tasks para o Codex / Agent.

## Descrição
O componente Codex Tasks é responsável por gerar tarefas acionáveis e específicas para agentes de IA, como o GitHub Copilot Agent. Ele utiliza templates padronizados para criar prompts detalhados, saídas esperadas e critérios de aceitação, facilitando a execução incremental de tarefas em projetos de desenvolvimento.

## Como Usar
1. Escolha um template em `templates/task_template.md`.
2. Preencha os campos: título, descrição, prompts, saídas esperadas, critérios de aceitação.
3. Use o prompt gerado no chat do Copilot Agent para executar a tarefa.
4. Exemplos estão disponíveis em `examples/`.

## Integração com Copilot Agent
Para usar o Codex Tasks com GitHub Copilot Agent:
1. Preencha um template em `templates/task_template.md`.
2. Cole o prompt gerado no chat do Copilot.
3. Execute as saídas esperadas e valide com os critérios de aceitação.

## Estrutura
- `examples/`: Exemplos de tarefas preenchidas (ex.: setup de ambiente, criação de casos de uso).
- `templates/`: Templates base para criar novas tarefas.

Gera tasks para o Codex / Agent.
