# Guia de Utilização do MCP Fullcycle no Projeto Alvo

## Visão Geral

O **MCP Fullcycle** é um toolkit integrado para desenvolvimento colaborativo guiado por IA, composto por 4 componentes principais:

- **Mesa Tech**: Discussões colaborativas em rodadas
- **MCP Dev Flow**: Workflow estruturado de 10 fases
- **Super Auditor**: Validações de código e segurança
- **Codex Tasks**: Geração automática de tarefas

Este guia mostra como integrar e usar o MCP Fullcycle em qualquer projeto alvo via GitHub Copilot (modo agente).

## Pré-requisitos

### 1. Ambiente de Desenvolvimento
- **Node.js**: Versão 18 ou superior
- **Docker**: Com Docker Compose
- **IntelliJ IDEA**: Para integração IDE
- **GitHub Copilot**: Assinatura ativa com modo agente

### 2. Projeto MCP Fullcycle
Clone e configure o repositório MCP:
```bash
git clone <repo-mcp-fullcycle>
cd mcp-fullcycle
./setup.sh
npm run mcp:up
```

## Configuração do Projeto Alvo

### Passo 1: Copiar Arquivos .idea
Copie os arquivos de configuração do IntelliJ para o projeto alvo:

```bash
# No diretório do projeto alvo
cp -r /caminho/para/mcp-fullcycle/.idea/* .idea/
```

**Arquivos a copiar:**
- `.idea/runConfigurations.xml` - Configurações de execução
- `.idea/fileTemplates.xml` - Templates de arquivo
- `.idea/workspace.xml` - Ferramentas externas

### Passo 2: Copiar Scripts de Automação
```bash
# Copiar scripts para o projeto alvo
cp /caminho/para/mcp-fullcycle/setup.sh .
cp /caminho/para/mcp-fullcycle/mcp-compose.sh .
cp /caminho/para/mcp-fullcycle/deploy.sh .

# Tornar executáveis
chmod +x setup.sh mcp-compose.sh deploy.sh
```

### Passo 3: Configurar package.json
Adicione estes scripts ao `package.json` do projeto alvo:

```json
{
  "scripts": {
    "mcp:up": "docker compose up -d",
    "mcp:down": "docker compose down",
    "mcp:health": "curl -f http://localhost:3000/healthz",
    "mcp:logs": "docker compose logs -f",
    "chat:mesa": "echo '@mesa-tech: Iniciando discussão em rodadas. Objetivo: $npm_config_goal'",
    "chat:mcp": "echo '@mcp: Executando fluxo MCP. Fase: $npm_config_phase'",
    "chat:auditor": "echo '@super-auditor: Executando validações de segurança e qualidade'",
    "chat:codex": "echo '@codex-tasks: Gerando tarefas para o projeto'"
  }
}
```

### Passo 4: Verificar Integração
```bash
# Testar setup
./setup.sh

# Iniciar serviços
npm run mcp:up

# Verificar saúde
npm run mcp:health
```

## Uso no Chat do GitHub Copilot

### Modo Agente
Certifique-se de que o GitHub Copilot está no **modo agente** no projeto alvo.

### Comandos Disponíveis

#### @mesa-tech - Discussões Colaborativas
Use para sessões de brainstorming e decisões em grupo.

**Exemplo 1 - Iniciar Discussão de Arquitetura:**
```
@mesa-tech Vamos discutir a arquitetura do novo módulo de autenticação. Precisamos decidir entre JWT e OAuth2. Participantes: @dev1, @dev2, @arquiteto.

Objetivos:
1. Avaliar prós e contras de cada abordagem
2. Considerar integração com sistemas existentes
3. Definir padrões de segurança

Por favor, facilite uma rodada de discussão estruturada.
```

**Resposta Esperada:**
```
@mesa-tech: Rodada de discussão iniciada para "arquitetura de autenticação".
Participantes: @dev1, @dev2, @arquiteto

Tópico: Decisão entre JWT e OAuth2

Pontos a discutir:
1. Segurança: JWT mais stateless, OAuth2 mais flexível
2. Complexidade: OAuth2 requer mais setup
3. Escalabilidade: Ambos adequados

Votação: JWT (60%), OAuth2 (40%)
Decisão: Usar JWT com refresh tokens
```

**Exemplo 2 - Tomada de Decisão Técnica:**
```
@mesa-tech Precisamos decidir a stack tecnológica para o frontend. Opções: React vs Vue.js vs Angular.

Critérios de decisão:
- Curva de aprendizado da equipe
- Ecossistema e comunidade
- Performance e escalabilidade
- Integração com backend existente

Inicie uma votação e consolide a decisão.
```

#### @mcp - Workflow de Desenvolvimento
Execute o workflow estruturado de 10 fases.

**Exemplo 1 - Iniciar Novo Projeto:**
```
@mcp Inicie o workflow MCP para o projeto "API de Pagamentos".

Contexto:
- Stack: Node.js + Express + PostgreSQL
- Equipe: 3 desenvolvedores backend
- Prazo: 4 semanas
- Requisitos: Autenticação, processamento de pagamentos, relatórios

Execute a Fase 1 (Intake) e prepare o planejamento.
```

**Resposta Esperada:**
```
@mcp: Workflow MCP iniciado para "API de Pagamentos"

Fase 1 (Intake) - Concluída ?

Planejamento preparado:
- Arquitetura: Microserviços com API Gateway
- Segurança: JWT + RBAC
- Banco: PostgreSQL com migrations
- Testes: Jest + Supertest (80% cobertura)
- CI/CD: GitHub Actions

Próxima fase: Analysis (Fase 2)
Use @mcp avançar para fase 2
```

**Exemplo 2 - Avançar Fase:**
```
@mcp Avance para a Fase 2 (Analysis) do projeto atual.

Análise solicitada:
- Riscos técnicos identificados
- Dependências externas mapeadas
- Estimativa de esforço por componente
- Plano de mitigação de riscos

Gere relatório detalhado da análise.
```

**Exemplo 3 - Revisão de Código:**
```
@mcp Execute a Fase 9 (Handover) para o módulo de usuários.

Checklist de handover:
- Documentação completa
- Testes unitários >80% cobertura
- Guias de deployment
- Plano de monitoramento
- Conhecimento transferido para equipe de ops

Prepare documentação final.
```

#### @super-auditor - Validações e Segurança
Execute auditorias de código e segurança.

**Exemplo 1 - Auditoria de Segurança:**
```
@super-auditor Execute auditoria completa de segurança no módulo de autenticação.

Verificações solicitadas:
- Validação de inputs (SQL injection, XSS)
- Controle de acesso e autorização
- Gerenciamento seguro de senhas
- Logs de segurança adequados
- Conformidade com LGPD/GDPR

Gere relatório com vulnerabilidades encontradas e recomendações.
```

**Resposta Esperada:**
```
@super-auditor: Auditoria de segurança concluída

Vulnerabilidades encontradas:
1. SQL Injection em login (Crítico) - Recomendação: Usar prepared statements
2. Senhas em texto plano (Alto) - Recomendação: Hash com bcrypt
3. Logs insuficientes (Médio) - Recomendação: Adicionar audit logs

Pontuação de segurança: 6.5/10
Recomendações implementadas: 3/5
```

**Exemplo 2 - Validação de Qualidade:**
```
@super-auditor Valide a qualidade do código do novo serviço de notificações.

Critérios:
- Cobertura de testes >70%
- Complexidade ciclomática <10
- Dívida técnica identificada
- Padrões de código seguidos
- Performance aceitável

Forneça feedback estruturado para melhorias.
```

#### @codex-tasks - Geração de Tarefas
Gere tarefas automaticamente baseadas em objetivos.

**Exemplo 1 - Planejamento de Sprint:**
```
@codex-tasks Gere tarefas para a implementação do sistema de cache.

Contexto:
- Tecnologia: Redis + Node.js
- Funcionalidades: Cache de queries, invalidação, monitoramento
- Equipe: 2 desenvolvedores
- Prazo: 1 semana

Quebre em tarefas acionáveis com estimativas e dependências.
```

**Resposta Esperada:**
```
@codex-tasks: Tarefas geradas para sistema de cache

1. [Backend] Configurar conexão Redis (2h) - Sem dependências
2. [Backend] Implementar cache de queries (4h) - Depende de 1
3. [Backend] Sistema de invalidação (3h) - Depende de 2
4. [Backend] Métricas de monitoramento (2h) - Depende de 2
5. [Frontend] Integração com cache (1h) - Depende de 2
6. [Testes] Testes de integração (3h) - Depende de 2,3,4
7. [Docs] Documentação de uso (1h) - Depende de 6

Total estimado: 16h
Prazo: 1 semana (32h disponíveis)
```

**Exemplo 2 - Refatoração Técnica:**
```
@codex-tasks Planeje a migração do módulo legado para microserviços.

Escopo:
- Identificar boundaries dos serviços
- Definir contratos de API
- Planejar migração incremental
- Estratégia de deployment
- Rollback plan

Gere lista detalhada de tarefas priorizadas.
```

## API Endpoints Disponíveis

O MCP Fullcycle fornece endpoints REST para integração programática:

### GET /healthz
Verifica saúde do sistema.
```bash
curl http://localhost:3000/healthz
# {"status":"ok"}
```

### GET /packs
Lista packs disponíveis.
```bash
curl http://localhost:3000/packs
# {"packs": [{"id": "mesa", "description": "..."}, ...]}
```

### POST /test-flow
Executa teste de fluxo.
```bash
curl -X POST http://localhost:3000/test-flow \
  -H "Content-Type: application/json" \
  -d '{"goal": "Teste", "phases": ["intake"]}'
```

## Cenários Práticos de Uso

### Cenário 1: Novo Projeto de E-commerce
```
# 1. Iniciar discussão arquitetural
@mesa-tech Discutir arquitetura do e-commerce. Equipe: @product, @dev, @qa

# 2. Executar workflow MCP
@mcp Iniciar workflow para projeto "E-commerce B2B".
Stack: React + Node.js + MongoDB
Equipe: 5 devs, 2 QAs, 1 PO

# 3. Gerar tarefas iniciais
@codex-tasks Quebrar em tarefas o desenvolvimento do catálogo de produtos

# 4. Validar segurança
@super-auditor Auditar módulo de pagamentos por vulnerabilidades
```

### Cenário 2: Refatoração de Sistema Legado
```
# 1. Análise inicial
@mcp Execute análise do sistema legado de RH

# 2. Planejamento de refatoração
@codex-tasks Planeje migração do monolito para microserviços

# 3. Discussão de estratégia
@mesa-tech Debater abordagem incremental vs big bang

# 4. Validação contínua
@super-auditor Monitore qualidade durante refatoração
```

### Cenário 3: Feature de Alta Complexidade
```
# 1. Planejamento detalhado
@codex-tasks Quebre a implementação de machine learning em tarefas

# 2. Discussão técnica
@mesa-tech Avaliar algoritmos: TensorFlow vs PyTorch

# 3. Workflow estruturado
@mcp Execute fases 1-5 para o módulo de ML

# 4. Auditoria final
@super-auditor Valide conformidade com regulamentações de dados
```

## Integração com IntelliJ

### Run Configurations
Após copiar `.idea/runConfigurations.xml`, você terá:

- **Run MCP Flow**: Executa aplicação local
- **MCP Planning**: Foco em planejamento
- **MCP Implementation**: Foco em implementação
- **MCP Review**: Foco em review

### External Tools
Ferramentas disponíveis no menu Tools > External Tools:

- **MCP Build**: `npm run build`
- **MCP Health Check**: Verifica saúde
- **MCP Docker Up**: Inicia serviços
- **MCP Docker Down**: Para serviços

### File Templates
Templates disponíveis em File > New:

- **MCP Flow Input**: Para entradas de fluxo
- **MCP Pack Template**: Para criar novos packs

## Testes e Validação

### Executar Testes
```bash
# Testes unitários
npm run test -- tests/unit

# Testes de integração
npm run test -- tests/integration

# Validação completa
npm run validate
```

### Métricas de Qualidade
- **Cobertura de Testes**: >70%
- **Complexidade**: <10
- **Saúde do Sistema**: OK
- **Performance**: Resposta <100ms

## Troubleshooting

### Problema: Comando @ não reconhecido
**Solução**: Certifique-se de que o Copilot está no modo agente e o MCP está rodando.

### Problema: Serviços Docker não iniciam
**Solução**:
```bash
docker compose down
docker compose up -d
npm run mcp:health
```

### Problema: Erro de build
**Solução**:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Problema: IntelliJ não reconhece configurações
**Solução**: Reinicie o IntelliJ após copiar os arquivos `.idea/`.

### Problema: API não responde
**Solução**:
```bash
# Verificar se serviço está rodando
docker compose ps

# Reiniciar
npm run mcp:down
npm run mcp:up
```

## FAQ - Perguntas Frequentes

### Como instalar o MCP se não tenho Docker?
Use a versão local: `npm run dev` após `npm run build`.

### O que fazer se o Copilot não responde aos comandos @?
1. Verifique se está no modo agente
2. Confirme que o MCP está rodando: `npm run mcp:health`
3. Tente reiniciar o chat

### Como personalizar os packs para meu projeto?
Edite os arquivos em `src/packs/` e reconstrua: `npm run build && npm run deploy`

### Posso usar o MCP offline?
Sim, execute localmente sem Docker para desenvolvimento offline.

### Como monitorar o uso do MCP?
Use `npm run mcp:logs` e os relatórios em `evaluation_report.json`

## Dicas Avançadas

### 1. Combinar Comandos
```bash
# Workflow completo com validações
@mcp Execute intake para novo projeto
@codex-tasks Gere tarefas detalhadas
@super-auditor Valide arquitetura proposta
@mesa-tech Discuta implementação com equipe
```

### 2. Integração com Git
```bash
# Commits seguindo MCP
git commit -m "feat: Implementa fase 3 - Arquitetura

- Define boundaries dos serviços
- Estabelece contratos de API
- Configura CI/CD básico

@mcp avançar para fase 4"
```

### 3. Monitoramento Contínuo
```bash
# Script de monitoramento
#!/bin/bash
npm run mcp:health
@super-auditor executar validações diárias
@mcp verificar progresso do workflow
```

## Métricas de Sucesso e Monitoramento

### KPIs para Avaliar o Uso do MCP

#### Métricas de Produtividade
- **Tempo de Ciclo**: Redução no tempo de entrega de features
- **Taxa de Defeitos**: Diminuição de bugs em produção
- **Cobertura de Testes**: Manutenção >70% consistente
- **Satisfação da Equipe**: Pesquisas regulares sobre usabilidade

#### Métricas de Qualidade
- **Pontuação de Segurança**: Melhoria contínua nas auditorias
- **Complexidade de Código**: Manutenção <10
- **Dívida Técnica**: Redução identificada
- **Conformidade**: Aderência a padrões regulatórios

#### Como Monitorar
```bash
# Relatório semanal
npm run mcp:health
@super-auditor gerar relatório semanal
@mcp analisar métricas do projeto

# Dashboard de acompanhamento
# - Commits seguindo MCP
# - Issues resolvidas por fase
# - Tempo médio por validação
```

## Integração com Ferramentas Externas

### Jira/Issue Tracking
```bash
# Criar issues automaticamente
@codex-tasks Criar issues no Jira para tarefas geradas

# Sincronizar status
@mcp Atualizar status das fases no Jira
```

### Slack/Teams
```bash
# Notificações automáticas
@mesa-tech Enviar convites para reuniões no Slack

# Relatórios diários
@super-auditor Enviar relatório de qualidade no Teams
```

### CI/CD Pipelines
```bash
# Integração com GitHub Actions
@mcp Executar validações em pipeline
@super-auditor Auditar código em PR
```

## Personalização Avançada

### Criando Packs Customizados

#### Estrutura Básica
```typescript
// src/packs/custom-pack.ts
import { PromptPack, Phase } from '../types';

export const customPack: PromptPack = {
  id: 'custom',
  description: 'Pack personalizado para necessidades específicas',
  appliesTo: [Phase.Implementation],
  buildPrompt: async (goal: string, template: string) => {
    // Lógica customizada
    return `Prompt customizado: ${goal}`;
  },
};
```

#### Registro do Pack
```typescript
// src/packs/index.ts
export { customPack } from './custom-pack';
```

#### Rebuild e Deploy
```bash
npm run build
npm run deploy
```

### Configurações Avançadas
- **Templates Customizados**: Edite `src/packs/` para prompts específicos
- **Regras de Validação**: Personalize em `src/tools/`
- **Integrações**: Adicione APIs externas nos tools

## Guia de Migração

### De Metodologias Tradicionais

#### Ágil Scrum
```
MCP Mapping:
- Sprint Planning ? @mcp Fase 1 + @codex-tasks
- Daily Standup ? @mesa-tech reuniões diárias
- Sprint Review ? @mcp Fase 9 (Handover)
- Retrospective ? @mesa-tech análise de melhorias
```

#### Waterfall
```
MCP Mapping:
- Requirements ? @mcp Fase 1 (Intake)
- Design ? @mcp Fase 3 (Architecture)
- Implementation ? @mcp Fase 4 (Implementation)
- Testing ? @mcp Fase 5 (Tests)
- Deployment ? @mcp Fase 9 (Handover)
```

### Migração Gradual
1. **Piloto**: Use MCP em um projeto pequeno
2. **Treinamento**: Capacite a equipe nos comandos @
3. **Integração**: Conecte com ferramentas existentes
4. **Expansão**: Aplique em projetos maiores

## Exemplos de Relatórios e Interpretação

### Relatório de Auditoria
```
@super-auditor: Auditoria concluída

? Resumo:
- Vulnerabilidades críticas: 0
- Alto risco: 2 (senhas, logs)
- Médio risco: 3 (validações)
- Pontuação: 7.8/10

? Recomendações:
1. Implementar hash de senhas
2. Adicionar logs de auditoria
3. Melhorar validações de input
```

### Relatório de Tarefas
```
@codex-tasks: 12 tarefas geradas

? Breakdown:
- Backend: 6 tarefas (50%)
- Frontend: 3 tarefas (25%)
- Testes: 2 tarefas (17%)
- Documentação: 1 tarefa (8%)

?? Estimativa total: 28h
? Prazo: 2 semanas
? Equipe: 3 desenvolvedores
```

## Segurança e Conformidade

### Proteção de Dados
- **LGPD/GDPR**: Dados sensíveis mascarados automaticamente
- **Auditoria**: Logs de todas as interações
- **Controle de Acesso**: Validação de permissões por comando

### Uso Corporativo
- **VPN**: Execute MCP em rede corporativa
- **Firewalls**: Configure regras para comunicação com serviços
- **Compliance**: Relatórios de conformidade automática

### Boas Práticas
```bash
# Não compartilhar dados sensíveis nos prompts
# Usar sempre @super-auditor para validações
# Manter logs de auditoria
# Treinar equipe em segurança
```

## Treinamento da Equipe

### Programa de Capacitação

#### Nível 1: Básico (2h)
- O que é MCP Fullcycle
- Instalação e configuração
- Comandos @ básicos
- Cenários simples

#### Nível 2: Intermediário (4h)
- Workflows completos
- Personalização de packs
- Integração com ferramentas
- Troubleshooting

#### Nível 3: Avançado (6h)
- Desenvolvimento de packs customizados
- Integrações avançadas
- Monitoramento e métricas
- Otimização de performance

### Recursos de Treinamento
- **Documentação**: Guias completos em `doc/mcp-fullcycle/`
- **Exemplos**: Casos práticos no repositório
- **Suporte**: Issues no GitHub para dúvidas
- **Comunidade**: Grupos de discussão

## Referências e Recursos Adicionais

### Documentação Técnica
- [README Principal](README.md)
- [Manual do Usuário](manual.md)
- [Guia de Testes](guia_testes.md)
- [Integração IntelliJ](integracao_intellij.md)

### Sistema Poupador - Documentação Modular
- [README do Sistema](sistema_poupador/README.md) - Índice completo
- [Visão Geral](sistema_poupador/visao_geral.md) - Descrição do sistema
- [Arquitetura](sistema_poupador/arquitetura_tecnologias.md) - Tecnologias e decisões
- [Estrutura](sistema_poupador/estrutura_aplicacao.md) - Organização do código
- [Funcionalidades](sistema_poupador/funcionalidades_chave.md) - Capacidades principais
- [Testes](sistema_poupador/testes_qualidade.md) - Estratégia de qualidade
- [Fluxo Manual](sistema_poupador/fluxo_teste_manual.md) - Processo atual de testes

### Repositórios Relacionados
- [MCP Dev Flow](https://github.com/exemplo/mcp-dev-flow)
- [Super Auditor](https://github.com/exemplo/super-auditor)
- [Codex Tasks](https://github.com/exemplo/codex-tasks)

### Comunidade
- **GitHub Issues**: Para bugs e features
- **Discussions**: Para dúvidas gerais
- **Wiki**: Tutoriais avançados

### Contato e Suporte
- **Email**: suporte@mcp-fullcycle.com
- **Slack**: #mcp-fullcycle
- **Documentação**: Sempre atualizada

---

**Glossário**
- **Pack**: Componente especializado do MCP
- **Fase**: Etapa do workflow de desenvolvimento
- **Modo Agente**: Configuração avançada do GitHub Copilot
- **Orquestrador**: Componente que coordena os packs

---

**Histórico de Versões**
- **v1.0** (16/11/2025): Lançamento inicial com 4 packs
- **v1.1** (planejado): Integrações com ferramentas externas
- **v1.2** (planejado): Packs customizados via UI

## Mão na Massa: Exemplo Prático Completo

### Cenário: Otimização e Automação do Sistema Monolítico de Cálculo Poupador

Vamos aplicar todas as ferramentas do MCP Fullcycle em um cenário real: a otimização de um sistema monolítico Java/Spring Boot, focando na automação do fluxo de testes e melhorias de qualidade, mantendo a arquitetura monolítica conforme restrições do projeto.

O sistema atual possui um fluxo de testes **100% manual** que envolve:
- Backup manual da tabela `pedido_economia`
- Contagem manual de registros
- Separação manual de pedidos via queries complexas
- Reprocessamento individual de cada pedido

Nosso objetivo é transformar isso em um sistema automatizado isolado, mantendo o monolito.

#### 1. Discussão Inicial com Mesa Tech
**Contexto Específico**: O sistema tem ~60% cobertura de testes, validações insuficientes, e o fluxo de testes consome 30-60 minutos por execução.

```
@mesa-tech Precisamos discutir melhorias no sistema monolítico de cálculo poupador (Java/Spring Boot + Oracle).

Contexto atual:
- Monolito com Spring Boot 3.2.5 + Oracle JDBC 19.3.0.0
- Funcionalidades: cálculo de poupador/TACOM, processamento de pedidos, gestão de funcionários
- Problemas identificados:
  * Fluxo de testes 100% manual (backup + reprocessamento)
  * Cobertura de testes ~60% (meta: 85%)
  * Validações de segurança insuficientes (risco de SQL injection)
  * Complexidade ciclomática >10 em métodos críticos
  * Monitoramento limitado (apenas Spring Boot Actuator básico)

Objetivos das melhorias:
1. Automatizar completamente o fluxo de testes (backup/reprocessamento)
2. Implementar validações robustas de segurança e entrada
3. Melhorar cobertura de testes para 85%+
4. Otimizar performance com cache Redis
5. Aprimorar monitoramento e alertas

Participantes: @arquiteto-senior, @dev-backend, @qa-lead, @dba-oracle

Facilite uma discussão estruturada sobre prioridades e abordagem.
```

**Resposta Esperada Detalhada:**
```
@mesa-tech: Discussão sobre otimização do sistema poupador iniciada.

Participantes confirmados: @arquiteto-senior, @dev-backend, @qa-lead, @dba-oracle

? Pautas discutidas:
1. **Fluxo de Testes Manual**: Scripts SQL executados individualmente
2. **Problemas de Segurança**: Queries dinâmicas, validações insuficientes
3. **Cobertura de Testes**: Atual 62%, meta 85%
4. **Performance**: Queries não otimizadas, falta cache

? Abordagens propostas:
- Incremental: Melhorias graduais no monolito
- Isolada: Sistema de automação como módulo separado
- Testável: Alta cobertura e testes automatizados

?? Votação final:
- Priorizar automação de testes: 100% (4/4)
- Implementar validações de segurança: 100% (4/4)
- Melhorar cobertura de testes: 75% (3/4)

? Decisão: Abordagem incremental focada em automação e segurança
```

#### 2. Planejamento com MCP Workflow
**Contexto Específico**: Sistema legado com 5 anos, equipe de 4 devs, prazo de 2 meses para melhorias críticas.

```
@mcp Inicie workflow MCP para projeto "Otimização Sistema Poupador Monolítico".

Contexto técnico detalhado:
- **Stack Atual**: Java 21, Spring Boot 3.2.5, Oracle 19c
- **Arquitetura**: Monolito com pacotes modulares (business, controller, service, repository)
- **Banco**: Oracle com JDBC 19.3.0.0, tablespaces específicos
- **Equipe**: 4 desenvolvedores (2 backend, 1 QA, 1 DBA)
- **Prazo**: 8 semanas (2 sprints)
- **Restrições**: Manter arquitetura monolítica
- **Objetivos Mensuráveis**:
  * Automação: 100% do fluxo de testes
  * Segurança: Pontuação >8.5/10
  * Qualidade: Cobertura >85%, complexidade <10
  * Performance: Resposta <500ms para cálculos

Execute Fase 1 (Intake) e faça análise detalhada das áreas críticas.
```

**Resposta Esperada Detalhada:**
```
@mcp: Workflow MCP iniciado para "Otimização Sistema Poupador Monolítico"

? Análise de Intake - Fase 1 Concluída ?

? **Áreas Críticas Identificadas:**

1. **Fluxo de Testes Manual** (Prioridade Crítica)
   - Scripts SQL executados manualmente
   - Risco de erro humano alto
   - Tempo: 45 min por execução

2. **Validações de Segurança** (Prioridade Alta)
   - Queries dinâmicas vulneráveis a SQL injection
   - Validações de entrada insuficientes

3. **Cobertura de Testes** (Prioridade Alta)
   - Atual: 62% (meta: 85%)
   - Falta testes de integração

4. **Performance e Monitoramento** (Prioridade Média)
   - Queries não otimizadas
   - Falta cache

? **Métricas Iniciais:**
- Segurança: 6.2/10
- Qualidade: 6.5/10
- Performance: 7.0/10

? **Próxima fase**: Analysis (Fase 2)
Use @mcp avançar para fase 2
```

#### 3. Geração de Tarefas com Codex Tasks
**Contexto Específico**: Quebrar a automação do fluxo de testes em tarefas técnicas específicas.

```
@codex-tasks Planeje a implementação completa da automação do fluxo de testes.

Contexto técnico específico:
- **Fluxo Atual Manual**:
  1. CREATE TABLE pedido_economia_backup...
  2. SELECT COUNT(*) FROM pedido_economia_backup
  3. Query complexa JOIN para separação de pedidos
  4. Reprocessamento individual de pedidos

- **Tecnologias**: Java 21, Spring Boot 3.2.5, Oracle 19c
- **Equipe**: 2 devs backend + 1 DBA Oracle
- **Prazo**: 3 semanas

Quebre em tarefas técnicas detalhadas com estimativas realistas.
```

**Resposta Esperada Detalhada:**
```
@codex-tasks: Plano detalhado para automação do fluxo de testes

? **Tarefas Técnicas - Sprint 1 (3 semanas)**

**? Épico: Automação do Backup**
1. **[Database] Criar Stored Procedure sp_backup_automatico** (6h) - DBA
2. **[Database] Implementar SP sp_validar_backup** (4h) - DBA

**? Épico: Separação de Pedidos**
3. **[Database] Otimizar Query de Separação** (5h) - DBA
4. **[Database] Criar SP sp_separar_pedidos_teste** (4h) - DBA

**? Épico: Sistema de Automação Backend**
5. **[Backend] Criar entidade TestExecution** (3h) - Dev
6. **[Backend] Implementar TestAutomationService** (8h) - Dev
7. **[Backend] Criar TestAutomationController** (4h) - Dev

**? Épico: Validações e Segurança**
8. **[Backend] Implementar validações pré-teste** (3h) - Dev

**? Épico: Testes e Qualidade**
9. **[Testes] Criar testes unitários** (6h) - Dev
10. **[Testes] Implementar TestContainers** (4h) - Dev

**? Épico: Monitoramento e Operação**
11. **[DevOps] Configurar métricas customizadas** (3h) - Dev
12. **[DevOps] Criar job agendado** (2h) - Dev

**? Estimativas Totais:**
- **Database (DBA)**: 19h (5 tarefas)
- **Backend (Dev)**: 29h (6 tarefas)
- **Testes (Dev)**: 10h (2 tarefas)
- **Total**: 63h (12 tarefas)
- **Equipe**: 3 pessoas
- **Prazo**: 3 semanas
```

#### 4. Validação de Segurança com Super Auditor
**Contexto Específico**: Foco nas vulnerabilidades do código Java/Spring Boot.

```
@super-auditor Execute auditoria completa de segurança no sistema de cálculo poupador.

Verificações solicitadas:
- SQL injection em queries de cálculo financeiro
- XSS em responses JSON
- Controle de acesso aos endpoints
- Logs de auditoria para operações críticas
- Conformidade LGPD para dados pessoais

Gere relatório detalhado com severidade e localização exata.
```

**Resposta Esperada Detalhada:**
```
@super-auditor: Auditoria de segurança completa - Sistema Poupador

? **Vulnerabilidades Críticas Encontradas:**

1. **SQL Injection - CalculoMensal.java:145** (Crítico)
   - **Localização**: Método calcularPoupador()
   - **Código Vulnerável**: String query = "SELECT * FROM pedido_economia WHERE id_pedido = " + pedidoId;
   - **Correção**: Usar prepared statements

2. **Validação Insuficiente - PedidoController.java:78** (Alto)
   - **Localização**: Endpoint /api/pedidos/calcular
   - **Correção**: Adicionar @Valid

? **Vulnerabilidades Médias:**
3. **Controle de Acesso** (Médio)
4. **Rate Limiting Ausente** (Médio)

? **Pontuação Geral: 5.8/10**
- **Críticas**: 2 (bloqueiam deploy)
- **Altas**: 1 (corrigir urgentemente)
- **Médias**: 2 (melhorar gradualmente)
```

#### 5. Validação de Qualidade de Código
**Contexto Específico**: Análise focada no código Java/Spring Boot.

```
@super-auditor Valide a qualidade do código do sistema monolítico de cálculo.

Critérios:
- Cobertura de testes >80%
- Complexidade ciclomática <10 por método
- Dívida técnica reduzida
- Padrões Spring Boot seguidos

Forneça feedback estruturado por pacotes.
```

**Resposta Esperada Detalhada:**
```
@super-auditor: Análise de Qualidade de Código - Sistema Poupador

? **Métricas Gerais:**
- **Linhas de Código**: 15.247
- **Cobertura de Testes**: 62.3%
- **Complexidade Média**: 8.7
- **Dívida Técnica**: 45 dias

? **Análise por Pacotes:**

**? business (Prioridade Alta)**
- **Cobertura**: 45% (meta: 90%)
- **Complexidade**: 12.3 (meta: <10)
- **Problemas**: CalculoMensal.java complexo

**? controller (Prioridade Média)**
- **Cobertura**: 78% (meta: 95%)
- **Problemas**: Falta @Valid

**? service (Prioridade Alta)**
- **Cobertura**: 55% (meta: 85%)
- **Problemas**: Lógica misturada

? **Plano de Ação:**
- Sprint 1: Refatorar métodos complexos
- Sprint 2: Melhorar cobertura
- Sprint 3: Otimizar queries
```

#### 6. Discussão de Resultados com Mesa Tech
**Contexto Específico**: Consolidar achados das auditorias.

```
@mesa-tech Consolidar resultados das auditorias para roadmap.

Resultados:
- Segurança: 5.8/10 (2 críticas)
- Qualidade: Cobertura 62%, complexidade 8.7
- Automação: 63h estimadas

Decisões: Sprint 1 focado em segurança crítica.
```

#### 7. Avanço no Workflow MCP
**Contexto Específico**: Documentar arquitetura das melhorias.

```
@mcp Avance para Fase 3 (Architecture).

Arquitetura:
- Stored procedures para automação
- Módulo test-automation isolado
- Endpoints REST
- Validações de segurança
- Cache Redis

Documente a arquitetura proposta.
```

#### 8. Finalização e Handover
**Contexto Específico**: Checklist completo para entrega.

```
@mcp Execute Fase 9 (Handover).

Checklist:
- ? Stored procedures criadas
- ? Módulo implementado
- ? Endpoints funcionando
- ? Segurança auditada
- ? Cobertura >85%
- ? Documentação completa

Prepare métricas finais.
```

### Resultado Final do Exemplo

Após aplicar todas as ferramentas do MCP:

1. **Discussão estruturada** definiu prioridades
2. **Workflow MCP** guiou todas as fases
3. **Codex Tasks** quebrou em 12 tarefas (63h)
4. **Super Auditor** identificou vulnerabilidades críticas
5. **Mesa Tech** facilitou decisões colaborativas

**Melhorias alcançadas**:
- **Segurança**: +58% (5.8/10 ? 9.2/10)
- **Qualidade**: +40% cobertura (62% ? 87%)
- **Automação**: 100% (45min ? 3min)
- **Performance**: +200% throughput

Este exemplo demonstra como o MCP Fullcycle otimiza sistemas monolíticos mantendo a arquitetura existente.
