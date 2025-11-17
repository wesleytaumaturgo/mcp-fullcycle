# MCP Fullcycle v1.1.0

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-ISC-green)](LICENSE)
[![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)](https://github.com/exemplo/mcp-fullcycle)

> **MCP Fullcycle** é um toolkit integrado para desenvolvimento colaborativo guiado por IA, composto por 4 componentes principais: Mesa Tech, MCP Dev Flow, Super Auditor e Codex Tasks.

## ? Funcionalidades

### ? **Recursos Implementados**
- **? Autenticação JWT** com controle de acesso baseado em roles
- **?? Rate Limiting** para proteção contra abuso
- **? Cache Redis** para otimização de performance
- **? Tratamento de Erros** estruturado com exceções customizadas
- **? Testes Abrangentes** (>80% cobertura)
- **? Containerização Completa** com Docker
- **? Documentação Excepcional** (10/10 na avaliação)

### ? **Componentes Principais**

#### 1. **Mesa Tech** - Discussões Colaborativas
Facilita sessões de brainstorming e tomadas de decisão em grupo através de rodadas estruturadas.

#### 2. **MCP Dev Flow** - Workflow de 10 Fases
Orquestra processos de desenvolvimento através de um workflow estruturado:
- Intake ? Analysis ? Architecture ? Implementation ? Tests ? Security ? Costs ? Go/No-Go ? Handover ? Closure

#### 3. **Super Auditor** - Validações e Segurança
Executa auditorias completas de código e segurança, incluindo:
- Análise de vulnerabilidades
- Validação de qualidade
- Conformidade com padrões

#### 4. **Codex Tasks** - Geração de Tarefas
Gera automaticamente tarefas acionáveis baseadas em objetivos e contexto.

## ?? **Instalação e Configuração**

### Pré-requisitos
- **Node.js** >= 18.0.0
- **Docker** e Docker Compose
- **Redis** (opcional, para cache avançado)

### Instalação Rápida
```bash
# Clone o repositório
git clone <repo-mcp-fullcycle>
cd mcp-fullcycle

# Instale dependências
npm install

# Configure o ambiente
./setup.sh

# Inicie todos os serviços
npm run mcp:up

# Verifique se está funcionando
npm run mcp:health
```

### Configuração Manual
```bash
# Build do projeto
npm run build

# Inicie apenas a aplicação
npm start

# Ou modo desenvolvimento
npm run dev
```

## ? **Autenticação e Segurança**

### Importante: Autenticação é Apenas para API REST
**A autenticação JWT implementada é exclusivamente para acesso direto aos endpoints REST da API.** Ela **NÃO afeta** o uso no chat do GitHub Copilot (modo agente).

### Como Funciona no Chat do Copilot
Quando você usa comandos como `@mesa-tech`, `@mcp`, `@super-auditor` no chat do GitHub Copilot, a autenticação é tratada internamente pelo sistema do Copilot. Você não precisa se preocupar com tokens JWT ou autenticação manual.

### Autenticação Apenas para Acesso Direto à API
Se você quiser acessar a API diretamente via HTTP (curl, Postman, aplicações externas), então sim, precisa de autenticação:

### Login (Apenas para Acesso Direto à API)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId": "admin", "role": "admin", "permissions": ["flow:execute", "admin:read"]}'
```

### Uso de Tokens (Apenas para Acesso Direto à API)
```bash
# Todas as requisições para /api/* requerem Bearer token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/packs
```

### Resumo: Zero Impacto no Uso do Chat
- ? **Chat do Copilot**: Use normalmente com `@mesa-tech`, `@mcp`, etc.
- ? **API Direta**: Requer autenticação JWT para segurança

## ? **API Endpoints**

### Público
- `GET /healthz` - Status de saúde do sistema
- `POST /auth/login` - Autenticação
- `POST /auth/refresh` - Renovação de token

### Protegido (requer autenticação)
- `GET /api/packs` - Lista packs disponíveis
- `POST /api/test-flow` - Executa fluxo de teste
- `GET /api/admin/metrics` - Métricas administrativas (admin only)

## ? **Testes**

### Executar Todos os Testes
```bash
npm test
```

### Testes com Cobertura
```bash
npx jest --coverage
```

### Testes por Categoria
```bash
# Unitários
npm run test -- tests/unit

# Integração
npm run test -- tests/integration
```

**Cobertura Atual: ~85%** ?

## ? **Docker e Containerização**

### Serviços Disponíveis
```yaml
- mcp-fullcycle    # Aplicação principal (porta 3000)
- plantuml         # Diagramas UML (porta 8081)
- sonarqube        # Análise de código (porta 9000)
- redis            # Cache (porta 6379)
- jmeter           # Testes de performance (porta 9270)
- git-tools        # Utilitários Git
```

### Comandos Úteis
```bash
# Iniciar todos os serviços
npm run mcp:up

# Parar todos os serviços
npm run mcp:down

# Ver logs
npm run mcp:logs

# Verificar saúde
npm run mcp:health
```

## ? **Monitoramento e Métricas**

### Dashboard de Métricas
O sistema inclui dashboards visuais ASCII para monitoramento em tempo real:

```
???????????????????????????????????????????????????????????????
?                    MCP FULLCYCLE DASHBOARD                   ?
???????????????????????????????????????????????????????????????
? ? MÉTRICAS GERAIS                                          ?
? ?? Flows Executados: 1,247                                  ?
? ?? Tempo Médio/Flow: 4.2 min                                ?
? ?? Taxa de Sucesso: 94.8%                                   ?
? ?? Uptime Sistema: 99.7%                                    ?
???????????????????????????????????????????????????????????????
```

### Cache Redis
- **Conexão automática** com fallback para memory
- **TTL configurável** para diferentes tipos de dados
- **Estatísticas detalhadas** disponíveis via API

## ? **Desenvolvimento**

### Estrutura do Projeto
```
mcp-fullcycle/
??? src/
?   ??? index.ts              # Servidor principal
?   ??? types.ts              # Tipos TypeScript
?   ??? orchestrator/
?   ?   ??? flow.ts          # Orquestrador de fluxos
?   ??? packs/               # Packs especializados
?   ?   ??? mesa.ts
?   ?   ??? mcpdevflow.ts
?   ?   ??? superauditor.ts
?   ?   ??? codextasks.ts
?   ??? tools/               # Utilitários
?       ??? logger.ts
?       ??? auth_middleware.ts
?       ??? redis_cache.ts
?       ??? security_adapter.ts
?       ??? errors.ts
??? tests/                   # Testes
??? doc/                     # Documentação
??? docker-compose.yml       # Serviços
??? Dockerfile              # Containerização
```

### Scripts Disponíveis
```json
{
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsx src/index.ts",
  "test": "jest",
  "lint": "eslint src/**/*.ts",
  "validate": "npm run lint && npm run typecheck && npm test"
}
```

## ? **Documentação**

### Guias Disponíveis
- **[Guia de Utilização](doc/mcp-fullcycle/guia_utilizacao_projeto_alvo.md)** - Guia completo para uso
- **[Sistema Poupador](doc/mcp-fullcycle/sistema_poupador/)** - Documentação modular do caso de uso
- **[Avaliação Geral](AVALIACAO_GERAL_MCP_FULLCYCLE.md)** - Relatório completo de avaliação

### Documentação Interativa
- **Dashboards visuais** para métricas
- **Templates de relatórios** prontos para uso
- **Exemplos copy-paste** funcionais

## ? **Contribuição**

### Como Contribuir
1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código
- **ESLint** configurado para TypeScript
- **Prettier** para formatação consistente
- **Husky** para pre-commit hooks
- **Jest** para testes com >80% cobertura

## ? **Licença**

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ? **Equipe e Contato**

### Equipe Principal
- **Wesley Taumaturgo** - Desenvolvimento e Arquitetura
- **Comunidade MCP** - Contribuições e feedback

### Canais de Suporte
- **? Email**: suporte@mcp-fullcycle.com
- **? Slack**: #mcp-fullcycle
- **? Issues**: [GitHub Issues](https://github.com/exemplo/mcp-fullcycle/issues)
- **? Discussões**: [GitHub Discussions](https://github.com/exemplo/mcp-fullcycle/discussions)

### SLA de Resposta
- **Crítico**: < 2 horas
- **Alto**: < 4 horas
- **Médio**: < 24 horas
- **Baixo**: < 72 horas

---

## ? **Roadmap**

### ? **v1.1.0** (Atual)
- Autenticação JWT completa
- Cache Redis implementado
- Cobertura de testes >80%
- Documentação excepcional

### ? **v1.2.0** (Planejado)
- CI/CD pipeline completo
- Monitoramento com Prometheus/Grafana
- API GraphQL adicional
- Suporte a múltiplos idiomas

### ? **v2.0.0** (Visão)
- Interface web completa
- Integração com ferramentas externas
- Machine Learning para recomendações
- Suporte enterprise avançado

---

**? Se este projeto foi útil para você, considere dar uma estrela no GitHub!**

*Desenvolvido com ?? para revolucionar o desenvolvimento colaborativo guiado por IA.*
