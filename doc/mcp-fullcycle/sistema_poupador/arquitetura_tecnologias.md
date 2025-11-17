# Arquitetura e Tecnologias

## Tipo de Arquitetura
- **Monolito**: Aplicação única e autocontida
- **Padrão**: Arquitetura em camadas (Controller ? Service ? Repository)

## Tecnologias Principais

### Linguagem e Framework
- **Java**: Versão 21
- **Spring Boot**: 3.2.5 (framework principal)
- **Build Tool**: Maven

### Banco de Dados
- **Oracle Database**: Sistema principal
- **JDBC Driver**: 19.3.0.0
- **Spring Data JPA**: Persistência de dados

### Frameworks e Bibliotecas
- **Spring Web**: APIs REST
- **Spring Boot Actuator**: Monitoramento e métricas
- **Spring Data JPA**: Acesso a dados
- **XStream**: Serialização XML (1.4.20)
- **Apache Commons**: Lang3, Collections4, Math3
- **Google Guava**: Utilitários (33.1.0-jre)
- **Gson**: JSON processing
- **Jakarta XML Bind**: XML API
- **SpringDoc OpenAPI**: Documentação de APIs (2.3.0)
- **Swagger**: Annotations (1.6.8), Models (2.2.21)

### Ambiente de Desenvolvimento
- **JDK**: 21
- **Maven**: Gerenciamento de dependências
- **IDE**: IntelliJ IDEA (configurações específicas)

### Infraestrutura
- **Deploy**: Via Nexus
- **Monitoramento**: Spring Boot Actuator
- **Jobs**: Agendados para processamento periódico

## Decisões Arquiteturais

### Por que Monolito?
- **Simplicidade**: Deploy único e manutenção facilitada
- **Performance**: Menor latência entre componentes
- **Consistência**: Transações ACID abrangentes
- **Desenvolvimento**: Equipe reduzida, curva de aprendizado menor

### Vantagens Técnicas
- **Transacionalidade**: Garantia de consistência
- **Performance**: Queries otimizadas em um único banco
- **Manutenibilidade**: Código centralizado
- **Testabilidade**: Testes de integração simplificados

### Considerações Futuras
- **Escalabilidade**: Possibilidade de extração de microsserviços
- **Tecnologias**: Migração gradual para versões mais recentes
- **Monitoramento**: Aprimoramento com ferramentas externas
