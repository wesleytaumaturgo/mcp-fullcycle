# Funcionalidades Chave

## Cálculo de Economia

### Descrição
Realiza cálculos complexos de poupador, incluindo:
- **Taxa 63 para Poupador VB**: Cálculo específico para vales-benefício
- **Quebra de taxas por produto/subproduto**: Análise granular
- **Ajustes baseados em condições comerciais**: Regras dinâmicas

### Algoritmos
- **CalculoPoupadorTacom**: Lógica principal TACOM
- **CalculoMensal**: Processamento mensal
- **CondicaoComercialBusiness**: Gestão de condições

### Precisão
- Cálculos financeiros com alta precisão
- Validação de regras de negócio
- Tratamento de edge cases

## Processamento de Pedidos

### Fluxo Sequencial
1. **Definição de Sequência**: Ordenação de processamento
2. **Criação de Novo Pedido**: Inicialização
3. **Cálculo de Pedido**: Execução dos algoritmos
4. **Cálculo de Taxas**: Aplicação de regras
5. **Finalização**: Conclusão e validação

### Características
- **Processamento Assíncrono**: Via executors
- **Reprocessamento**: Capacidade de retry
- **Validação de Integridade**: Checks automáticos
- **Logging Detalhado**: Rastreamento completo

### Jobs Agendados
- **Processamento em Lote**: Jobs periódicos
- **Performance Otimizada**: Execução assíncrona
- **Monitoramento**: Via Spring Boot Actuator

## Gestão de Funcionários e Saldos

### Elegibilidade
- **Verificação Automática**: Regras de negócio
- **Exceções Especiais**: Funcionários acima de 60 anos
- **Integração Legada**: EJBs para sistemas antigos

### Saldos e Quotas
- **Cálculo Final**: Saldos atualizados
- **Quotas Diárias**: Controle por dia
- **Quotas por Pedido**: Limites específicos

### Validações
- **Consistência**: Dados íntegros
- **Regras de Negócio**: Aplicadas rigorosamente
- **Auditoria**: Logs de todas as operações

## APIs REST

### Endpoints Principais
- **POST /api/pedidos/calcular**: Cálculo simples
- **GET /api/pedidos/elegibilidade**: Verificação de elegibilidade
- **POST /api/pedidos/reprocessar**: Reprocessamento
- **GET /api/config**: Configurações do sistema

### Documentação
- **OpenAPI/Swagger**: Documentação automática
- **SpringDoc**: Integração nativa
- **Exemplos**: Casos de uso documentados

### Segurança
- **Validação de Entrada**: DTOs com validações
- **Controle de Acesso**: Roles e permissões
- **Rate Limiting**: Proteção contra abuso

## Monitoramento e Observabilidade

### Spring Boot Actuator
- **Health Checks**: Status do sistema
- **Métricas**: Performance e uso
- **Info Endpoint**: Informações da aplicação

### Logging
- **Configurações**: Níveis por ambiente
- **Propriedades**: Logging detalhado
- **Rastreamento**: Requests e responses

### Alertas
- **Jobs Agendados**: Monitoramento de execução
- **Thresholds**: Alertas automáticos
- **Dashboards**: Visualização de métricas

## Validação e Exceções

### Regras de Validação
- **Rigorosas**: Consistência garantida
- **Customizadas**: Exceções específicas
- **Centralizadas**: Tratamento uniforme

### Tratamento de Errores
- **Exceptions Customizadas**: Excecoes.java
- **Logging**: Detalhado de configurações
- **Recovery**: Estratégias de retry

## Integração com Sistemas Legados

### EJBs
- **Comunicação**: Com sistemas antigos
- **Dados**: Sincronização de funcionários
- **Transacionalidade**: Consistência garantida

### Compatibilidade
- **Migrações**: Suporte a versões anteriores
- **Backward Compatibility**: Funcionalidades legadas
- **Gradual Migration**: Transição suave

Esta arquitetura monolítica garante simplicidade de deploy e manutenção, enquanto as tecnologias modernas asseguram performance e confiabilidade em um ambiente Oracle. O sistema opera em produção com jobs agendados para processamento assíncrono, suportando migrações e testes para manter compatibilidade com versões anteriores.
