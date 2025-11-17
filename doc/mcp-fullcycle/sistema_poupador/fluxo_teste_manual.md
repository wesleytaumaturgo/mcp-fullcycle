# Funcionamento Atual do Teste (Fluxo Manual)

## Visão Geral
O sistema atualmente possui um fluxo de testes **100% manual** que requer intervenção humana em cada etapa. Este processo consome tempo significativo e está propenso a erros humanos.

## Fluxo Atual Detalhado

### 1. Preparação do Ambiente de Teste

#### Backup da Tabela Principal
```sql
-- Criar backup da tabela pedido_economia
create table pedido_economia_backup TABLESPACE TS_DAD_SIGUSER_2M_01 as
select ecn.* from pedido_economia ecn;
```

**Propósito**: Preservar dados originais antes dos testes
**Tamanho Típico**: Milhares de registros
**Tempo Estimado**: 2-5 minutos

#### Verificação do Backup
```sql
-- Contar registros no backup
select count(*) from pedido_economia_backup ecn;
```

**Propósito**: Validar que o backup foi criado corretamente
**Saída Esperada**: Número de registros original
**Tempo Estimado**: 30 segundos

### 2. Separação de Pedidos para Teste

#### Query de Separação Complexa
```sql
create table pedido_economia_original as
select ecn.*
from pedido_economia_backup ecn, pedido peo, pedido pee
where ecn.id_pedido_ori = peo.id_pedido_ped
and ecn.id_pedido_ecn = pee.id_pedido_ped(+)
and pee.ob_vtonli_ped.dt_pagrea_ped is not null
```

**Propósito**: Identificar pedidos elegíveis para reprocessamento
**Critérios de Seleção**:
- Pedidos com data de pagamento preenchida
- Join entre tabelas pedido_economia, pedido (original), pedido (economia)
- Status específico de processamento

**Complexidade**: Query com múltiplos joins e condições
**Tempo Estimado**: 3-7 minutos
**Registros Típicos**: 100-500 pedidos

### 3. Execução dos Testes

#### Reprocessamento Individual
Para cada pedido identificado:
1. **Selecionar pedido**: Buscar dados específicos
2. **Executar cálculo**: Rodar algoritmos de poupador
3. **Validar resultado**: Comparar com valores esperados
4. **Registrar log**: Anotar resultado do teste

**Processo Manual**: Cada pedido processado individualmente
**Tempo por Pedido**: 1-2 minutos
**Total para 100 pedidos**: 100-200 minutos (1.5-3 horas)

### 4. Validação e Limpeza

#### Comparação de Resultados
- **Comparar valores**: Resultados novos vs originais
- **Validar consistência**: Regras de negócio aplicadas
- **Identificar discrepâncias**: Análise de diferenças

#### Limpeza do Ambiente
```sql
-- Remover tabelas temporárias
drop table pedido_economia_backup;
drop table pedido_economia_original;

-- Restaurar dados originais se necessário
-- (processo manual complexo)
```

## Problemas do Fluxo Atual

### Eficiência
- **Tempo Total**: 2-4 horas por ciclo de teste
- **Intervenção Humana**: 80% do tempo
- **Escalabilidade**: Limitada a poucos pedidos por vez

### Qualidade
- **Erro Humano**: Alto risco de falhas manuais
- **Consistência**: Dificuldade em garantir reprodutibilidade
- **Rastreabilidade**: Logs limitados e manuais

### Manutenibilidade
- **Documentação**: Processo não formalizado
- **Treinamento**: Conhecimento tácito
- **Evolução**: Difícil modificar ou otimizar

## Scripts SQL Principais

### Backup
```sql
create table pedido_economia_backup TABLESPACE TS_DAD_SIGUSER_2M_01 as
select ecn.* from pedido_economia ecn;
```

### Contagem
```sql
select count(*) from pedido_economia_backup ecn;
```

### Separação
```sql
create table pedido_economia_original as
select ecn.*
from pedido_economia_backup ecn, pedido peo, pedido pee
where ecn.id_pedido_ori = peo.id_pedido_ped
and ecn.id_pedido_ecn = pee.id_pedido_ped(+)
and pee.ob_vtonli_ped.dt_pagrea_ped is not null;
```

### Limpeza
```sql
drop table pedido_economia_backup;
drop table pedido_economia_original;
```

## Métricas do Processo Atual

- **Tempo Médio por Ciclo**: 180 minutos
- **Taxa de Sucesso**: 85% (15% falhas manuais)
- **Cobertura de Testes**: ~60% dos cenários
- **Custo por Ciclo**: 2-3 horas de trabalho humano

## Proposta de Automação

### Stored Procedures
- `sp_backup_automatico`: Backup automático com timestamp
- `sp_separar_pedidos_teste`: Separação automática baseada em regras
- `sp_validar_backup`: Validação de integridade

### API REST
- `POST /api/test-automation/execute`: Trigger de testes
- `GET /api/test-automation/executions`: Histórico
- `DELETE /api/test-automation/cleanup/{id}`: Limpeza

### Benefícios Esperados
- **Redução de Tempo**: 90% (180min ? 18min)
- **Eliminação de Erros**: 100% processos automatizados
- **Escalabilidade**: Milhares de pedidos simultaneamente
- **Rastreabilidade**: Logs completos e automáticos

Este fluxo manual representa uma oportunidade significativa de automação e melhoria da qualidade dos testes do sistema.
