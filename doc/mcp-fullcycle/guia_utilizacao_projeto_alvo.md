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

### ?? **Importante: Autenticação Não Afeta o Chat**
A autenticação JWT implementada é **exclusivamente para acesso direto à API REST**. Quando você usa os comandos `@mesa-tech`, `@mcp`, etc. no chat do GitHub Copilot, **não há necessidade de autenticação** - o Copilot gerencia isso internamente.

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
# Response:
{
  "packs": [
    {
      "id": "mesa",
      "name": "Mesa Tech",
      "description": "Discussões colaborativas em rodadas",
      "version": "1.0.0",
      "status": "active"
    },
    {
      "id": "mcp",
      "name": "MCP Dev Flow",
      "description": "Workflow estruturado de 10 fases",
      "version": "1.0.0",
      "status": "active"
    },
    {
      "id": "auditor",
      "name": "Super Auditor",
      "description": "Validações de código e segurança",
      "version": "1.0.0",
      "status": "active"
    },
    {
      "id": "codex",
      "name": "Codex Tasks",
      "description": "Geração automática de tarefas",
      "version": "1.0.0",
      "status": "active"
    }
  ]
}
```

### POST /test-flow
Executa teste de fluxo.
```bash
curl -X POST http://localhost:3000/test-flow \
  -H "Content-Type: application/json" \
  -d '{"goal": "Teste", "phases": ["intake"]}'
# Response:
{
  "flowId": "flow-12345",
  "status": "running",
  "phases": [
    {
      "id": "intake",
      "name": "Intake",
      "status": "completed",
      "duration": "2.3s",
      "result": {
        "analysis": "Sistema analisado com sucesso",
        "recommendations": ["Melhorar cobertura de testes", "Implementar validações"]
      }
    }
  ],
  "metrics": {
    "totalDuration": "2.3s",
    "phasesCompleted": 1,
    "phasesTotal": 1
  }
}
```

### GET /metrics
Obtém métricas do sistema.
```bash
curl http://localhost:3000/metrics
# Response:
{
  "uptime": "2d 4h 32m",
  "memory": {
    "used": "156MB",
    "total": "512MB",
    "percentage": 30.5
  },
  "flows": {
    "total": 47,
    "active": 3,
    "completed": 44,
    "failed": 0
  },
  "performance": {
    "avgResponseTime": "45ms",
    "requestsPerMinute": 12.3,
    "errorRate": 0.1
  }
}
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

![Run Configurations IntelliJ](images/intellij_run_configurations.png)
*Figura 1: Configurações de execução disponíveis no IntelliJ*

### External Tools
Ferramentas disponíveis no menu Tools > External Tools:

- **MCP Build**: `npm run build`
- **MCP Health Check**: Verifica saúde
- **MCP Docker Up**: Inicia serviços
- **MCP Docker Down**: Para serviços

![External Tools IntelliJ](images/intellij_external_tools.png)
*Figura 2: Ferramentas externas configuradas no IntelliJ*

### File Templates
Templates disponíveis em File > New:

- **MCP Flow Input**: Para entradas de fluxo
- **MCP Pack Template**: Para criar novos packs

![File Templates IntelliJ](images/intellij_file_templates.png)
*Figura 3: Templates de arquivo personalizados*

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

### Dashboard de Métricas MCP

#### Dashboard Principal
```
???????????????????????????????????????????????????????????????
?                    MCP FULLCYCLE DASHBOARD                   ?
???????????????????????????????????????????????????????????????
? ? MÉTRICAS GERAIS                                          ?
? ?? Flows Executados: 1,247                                  ?
? ?? Tempo Médio/Flow: 4.2 min                                ?
? ?? Taxa de Sucesso: 94.8%                                   ?
? ?? Uptime Sistema: 99.7%                                    ?
?                                                             ?
? ? PRODUTIVIDADE                                            ?
? ?? Features Entregues: +45% (vs baseline)                   ?
? ?? Tempo de Ciclo: -32% (vs baseline)                       ?
? ?? Bugs em Produção: -67% (vs baseline)                     ?
? ?? Satisfação Equipe: 8.7/10                                ?
?                                                             ?
? ? SEGURANÇA & QUALIDADE                                    ?
? ?? Pontuação Segurança: 8.9/10                              ?
? ?? Cobertura Testes: 87.3%                                  ?
? ?? Complexidade Média: 7.2                                  ?
? ?? Dívida Técnica: -40% (vs baseline)                       ?
?                                                             ?
? ? TENDÊNCIAS (Últimas 4 semanas)                           ?
? ?? Segurança: ?? +12%                                       ?
? ?? Qualidade: ?? +8%                                        ?
? ?? Produtividade: ?? +15%                                   ?
? ?? Eficiência: ?? +22%                                      ?
???????????????????????????????????????????????????????????????
```

#### Dashboard por Projeto
```
???????????????????????????????????????????????????????????????
?              DASHBOARD PROJETO: SISTEMA POUPADOR            ?
???????????????????????????????????????????????????????????????
? ? STATUS ATUAL                                             ?
? ?? Fase MCP: Implementation (Fase 4/10)                     ?
? ?? Progresso: 68% concluído                                 ?
? ?? Sprint Atual: Sprint 2/3                                 ?
? ?? Prazo Restante: 18 dias                                  ?
?                                                             ?
? ? TAREFAS PENDENTES                                        ?
? ?? ? Automação Backup: Concluído                           ?
? ?? ? Validações Segurança: Em andamento (75%)              ?
? ?? ? Testes Integração: Pendente                            ?
? ?? ? Documentação Final: Pendente                           ?
?                                                             ?
? ? MÉTRICAS DO PROJETO                                      ?
? ?? Segurança: 8.2/10 (Meta: 8.5)                            ?
? ?? Qualidade: 82% cobertura (Meta: 85%)                     ?
? ?? Performance: 450ms (Meta: <500ms)                        ?
? ?? Automação: 95% (Meta: 100%)                              ?
?                                                             ?
? ? ALERTAS ATIVOS                                           ?
? ?? ?? Complexidade método X > 10                             ?
? ?? ?? Cobertura testes < 80% em módulo Y                     ?
? ?? ?? Revisão arquitetural pendente                          ?
???????????????????????????????????????????????????????????????
```

### Templates de Relatórios

#### Template: Relatório Semanal de Qualidade
```markdown
# Relatório Semanal de Qualidade - MCP Fullcycle
**Período:** DD/MM/YYYY - DD/MM/YYYY
**Responsável:** [Nome]

## ? Resumo Executivo
- **Pontuação Geral:** X.X/10
- **Tendência:** ??/+X% vs semana anterior
- **Status:** ? Verde | ? Amarelo | ? Vermelho

## ? Métricas Detalhadas

### Segurança
- **Pontuação Atual:** X.X/10
- **Vulnerabilidades Críticas:** X (Meta: 0)
- **Vulnerabilidades Altas:** X (Meta: <2)
- **Ações Corretivas:** [Lista]

### Qualidade de Código
- **Cobertura de Testes:** XX.X% (Meta: >80%)
- **Complexidade Média:** X.X (Meta: <10)
- **Dívida Técnica:** X dias
- **Principais Problemas:** [Lista]

### Performance
- **Tempo Médio de Resposta:** XXXms (Meta: <500ms)
- **Throughput:** XXX req/min
- **Taxa de Erro:** X.X%
- **Bottlenecks Identificados:** [Lista]

## ? Próximas Ações
1. **[Prioridade Alta]** [Ação específica]
2. **[Prioridade Média]** [Ação específica]
3. **[Prioridade Baixa]** [Ação específica]

## ? Tendências
- **Segurança:** [Gráfico tendência]
- **Qualidade:** [Gráfico tendência]
- **Performance:** [Gráfico tendência]

---
*Relatório gerado automaticamente pelo MCP Fullcycle*
```

#### Template: Relatório de Auditoria de Segurança
```markdown
# Relatório de Auditoria de Segurança
**Data:** DD/MM/YYYY
**Sistema Auditado:** [Nome do Sistema]
**Auditor:** MCP Super Auditor v1.0

## ? Informações Gerais
- **Tipo de Auditoria:** Completa
- **Escopo:** [Descrição do escopo]
- **Metodologia:** OWASP Top 10 + Análise Estática

## ? Vulnerabilidades Críticas
| ID | Severidade | Localização | Descrição | Recomendação |
|----|------------|-------------|-----------|--------------|
| SEC-001 | Crítica | [Arquivo:Linha] | SQL Injection | Usar prepared statements |
| SEC-002 | Crítica | [Arquivo:Linha] | Autenticação fraca | Implementar MFA |

## ? Vulnerabilidades Altas
| ID | Severidade | Localização | Descrição | Recomendação |
|----|------------|-------------|-----------|--------------|
| SEC-003 | Alta | [Arquivo:Linha] | XSS refletido | Sanitizar inputs |
| SEC-004 | Alta | [Arquivo:Linha] | Controle de acesso | Implementar RBAC |

## ? Vulnerabilidades Médias
| ID | Severidade | Localização | Descrição | Recomendação |
|----|------------|-------------|-----------|--------------|
| SEC-005 | Média | [Arquivo:Linha] | Headers de segurança | Adicionar CSP |
| SEC-006 | Média | [Arquivo:Linha] | Logs insuficientes | Melhorar auditoria |

## ? Pontuação Geral
- **Pontuação de Segurança:** X.X/10
- **Melhoria vs Última Auditoria:** +X.X pontos
- **Conformidade LGPD:** XX% (Meta: 100%)

## ? Plano de Correção
### Semana 1-2 (Críticas)
- [ ] Corrigir SQL Injection
- [ ] Implementar autenticação robusta

### Semana 3-4 (Altas)
- [ ] Sanitizar inputs XSS
- [ ] Configurar RBAC

### Mês 2 (Médias)
- [ ] Adicionar headers de segurança
- [ ] Melhorar sistema de logs

## ? Métricas de Acompanhamento
- **Prazo para Correção:** 30 dias
- **Responsável:** [Nome/Equipe]
- **Próxima Auditoria:** DD/MM/YYYY

---
*Relatório gerado pelo MCP Super Auditor*
*Para mais detalhes, consulte: [Guia de Segurança](seguranca.md)*
```

---

**Glossário**
- **Pack**: Componente especializado do MCP
- **Fase**: Etapa do workflow de desenvolvimento
- **Modo Agente**: Configuração avançada do GitHub Copilot
- **Orquestrador**: Componente que coordena os packs
- **Flow**: Sequência de execução de um processo MCP
- **Intake**: Fase inicial de análise e planejamento
- **Sprint**: Período de desenvolvimento iterativo
- **Backlog**: Lista priorizada de tarefas pendentes
- **Burndown**: Gráfico de progresso do trabalho restante
- **Velocity**: Velocidade média de entrega da equipe
- **Technical Debt**: Dívida técnica acumulada
- **Code Coverage**: Percentual de código coberto por testes
- **Cyclomatic Complexity**: Complexidade ciclomática do código
- **SQL Injection**: Ataque de injeção de código SQL
- **XSS**: Cross-Site Scripting, vulnerabilidade web
- **OWASP**: Open Web Application Security Project
- **RBAC**: Role-Based Access Control
- **JWT**: JSON Web Token
- **API Gateway**: Ponto de entrada único para APIs
- **Microserviços**: Arquitetura de serviços independentes
- **Monolito**: Aplicação única e autocontida
- **CI/CD**: Continuous Integration/Continuous Deployment
- **Docker**: Plataforma de containerização
- **Kubernetes**: Sistema de orquestração de containers
- **REST**: Representational State Transfer
- **GraphQL**: Linguagem de consulta para APIs
- **WebSocket**: Protocolo de comunicação bidirecional
- **OAuth**: Protocolo de autorização
- **MFA**: Multi-Factor Authentication
- **CSP**: Content Security Policy
- **LGPD**: Lei Geral de Proteção de Dados (Brasil)
- **GDPR**: General Data Protection Regulation (Europa)

---

## Mecanismo de Feedback e Melhorias

### Como Contribuir com Melhorias

O MCP Fullcycle está em constante evolução. Sua contribuição é fundamental para tornar a ferramenta ainda melhor.

#### ? Reportar Problemas
Encontrou um bug ou comportamento inesperado?

1. **Verifique se já foi reportado** em [Issues do GitHub](https://github.com/exemplo/mcp-fullcycle/issues)
2. **Crie uma nova issue** com:
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Ambiente (SO, versão Node.js, etc.)
   - Logs de erro (se aplicável)

#### ? Sugerir Melhorias
Tem ideias para novos recursos ou melhorias?

1. **Abra uma Feature Request** em [GitHub Discussions](https://github.com/exemplo/mcp-fullcycle/discussions)
2. **Descreva claramente**:
   - O problema que resolve
   - Como funcionaria
   - Benefícios esperados
   - Impacto na experiência do usuário

#### ? Compartilhar Métricas de Uso
Ajude-nos a entender como o MCP está sendo usado:

```bash
# Comando para compartilhar métricas anônimas
npm run mcp:share-metrics
```

#### ? Testar Novas Funcionalidades
Quer testar recursos em desenvolvimento?

1. **Junte-se ao programa Beta** enviando email para beta@mcp-fullcycle.com
2. **Receba acesso antecipado** a novas funcionalidades
3. **Forneça feedback valioso** durante o desenvolvimento

### Processo de Atualização da Documentação

#### Versionamento Semântico
- **MAJOR**: Mudanças incompatíveis (ex: 2.0.0)
- **MINOR**: Novos recursos compatíveis (ex: 1.1.0)
- **PATCH**: Correções de bugs (ex: 1.0.1)

#### Ciclo de Release
1. **Desenvolvimento**: Novas features em `develop`
2. **Testes**: Validação em `staging`
3. **Release**: Merge para `main` com tag
4. **Documentação**: Atualização automática via CI/CD

#### Histórico de Releases
- **v1.1.0** (planejado): Dashboards visuais e templates de relatório
- **v1.0.0** (16/11/2025): Lançamento inicial com 4 packs
- **v0.9.0** (beta): Versão de testes com funcionalidades completas

### Suporte e Comunidade

#### Canais Oficiais
- **? Email**: suporte@mcp-fullcycle.com
- **? Slack**: #mcp-fullcycle (convite via email)
- **? GitHub Issues**: Para bugs e solicitações
- **? GitHub Discussions**: Para dúvidas gerais

#### Horários de Suporte
- **Suporte Técnico**: Segunda a sexta, 9h às 18h (GMT-3)
- **Emergências**: 24/7 para clientes enterprise
- **Comunidade**: Assíncrono via GitHub

#### SLA de Resposta
- **Crítico**: < 2 horas
- **Alto**: < 4 horas
- **Médio**: < 24 horas
- **Baixo**: < 72 horas

---

## English Version / Versão em Inglês

### MCP Fullcycle User Guide

#### Overview
MCP Fullcycle is an integrated toolkit for AI-guided collaborative development, composed of 4 main components:

- **Mesa Tech**: Collaborative discussions in rounds
- **MCP Dev Flow**: Structured workflow of 10 phases
- **Super Auditor**: Code and security validations
- **Codex Tasks**: Automatic task generation

This guide shows how to integrate and use MCP Fullcycle in any target project via GitHub Copilot (agent mode).

#### Quick Start
```bash
# 1. Clone and setup
git clone <mcp-repo>
cd mcp-fullcycle
./setup.sh
npm run mcp:up

# 2. Configure target project
cp -r .idea/* /path/to/target/project/.idea/
cp setup.sh mcp-compose.sh deploy.sh /path/to/target/project/

# 3. Add scripts to package.json
npm install
npm run mcp:health
```

#### Basic Usage
```bash
# Start discussion
@mesa-tech Let's discuss the new authentication module architecture

# Initialize workflow
@mcp Start MCP workflow for "Payment API" project

# Generate tasks
@codex-tasks Plan user registration implementation

# Security audit
@super-auditor Audit authentication module for vulnerabilities
```

For complete documentation in English, see: [MCP Fullcycle English Docs](https://docs.mcp-fullcycle.com)

---

**Última atualização:** 16 de novembro de 2025
**Versão:** 1.1.0-beta
**Contribuintes:** Wesley Taumaturgo e comunidade MCP

---

*Obrigado por usar o MCP Fullcycle! Sua contribuição ajuda a tornar o desenvolvimento colaborativo mais eficiente e seguro. ?*
