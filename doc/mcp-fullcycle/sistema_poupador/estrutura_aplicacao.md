# Estrutura da Aplicação

## Organização de Pacotes

A aplicação é organizada em pacotes modulares para facilitar manutenção e escalabilidade:

### business
Lógica de negócio principal, incluindo:
- **CalculoMensal**: Cálculos mensais de poupador
- **CondicaoComercialBusiness**: Gestão de condições comerciais
- Outros serviços de negócio específicos

### calculo
Algoritmos específicos para cálculos:
- **CalculoPoupadorTacom**: Lógica de cálculo TACOM
- Algoritmos especializados para diferentes tipos de cálculo

### controller
Controladores REST para exposição de APIs:
- Endpoints para cálculo simples
- Verificação de elegibilidade
- Reprocessamento de pedidos
- Configuração do sistema

### dto
Objetos de transferência de dados:
- Request/Response objects
- Validação de entrada
- Serialização/Deserialização

### enums
Enumerações para constantes:
- Tipos de taxa
- Status de processamento
- Categorias de benefício

### exceptions
Tratamento de exceções customizadas:
- **Excecoes**: Exceções específicas do domínio
- Tratamento centralizado de erros

### executor
Execução de tarefas assíncronas:
- **ExecutaProcessaPedido**: Processamento em background
- Jobs de longa duração

### interfaces
Contratos e interfaces para desacoplamento:
- Service interfaces
- Repository contracts
- Strategy patterns

### job
Jobs agendados para processamento periódico:
- Processamento automático de pedidos em lote
- Limpeza de dados temporários
- Relatórios automáticos

### model
Entidades JPA mapeadas para Oracle:
- **Periodo**: Períodos de cálculo
- **QuotaDiaria**: Quotas diárias
- Outras entidades de domínio

### repository
Repositórios para acesso a dados:
- Queries customizadas
- Stored procedures
- Otimizações de performance

### service
Serviços de negócio e integração:
- **PedidoEconomiaBusiness**: Lógica de pedidos
- Integração com sistemas externos
- Validações de negócio

### util
Utilitários diversos:
- **Parameters**: Configurações do sistema
- Helpers e utilities

### validation
Validações de regras de negócio:
- Regras específicas de cálculo
- Validações de elegibilidade

## Padrões de Design Utilizados

### Repository Pattern
- Abstração do acesso a dados
- Testabilidade melhorada
- Manutenibilidade

### Service Layer
- Lógica de negócio centralizada
- Transações gerenciadas
- Separação de responsabilidades

### DTO Pattern
- Transferência eficiente de dados
- Validação de entrada
- Contratos de API claros

### Strategy Pattern
- Algoritmos intercambiáveis
- Extensibilidade
- Manutenção facilitada

## Convenções de Código

### Nomenclatura
- Classes: PascalCase
- Métodos: camelCase
- Variáveis: camelCase
- Constantes: UPPER_CASE

### Estrutura de Pacotes
- Por funcionalidade (business, controller)
- Agrupamento lógico
- Facilita navegação

### Documentação
- JavaDoc em classes e métodos públicos
- Comentários explicativos
- Exemplos de uso

## Dependências entre Pacotes

```
controller ? service ? repository ? model
    ?         ?         ?
   dto      business  interfaces
    ?         ?         ?
validation  calculo    util
```

Esta estrutura garante modularidade, testabilidade e manutenibilidade do sistema monolítico.
