# Visão Geral do Sistema de Cálculo Poupador

## Projeto: BS-vbnet-poupador-calcula-economia
### Desenvolvedor: Wesley Taumaturgo
#### Data: 14 de Novembro de 2025 (Atualizado)

O **BS-vbnet-poupador-calcula-economia** é um sistema monolítico desenvolvido em **Java 21** utilizando **Spring Boot 3.2.5** como framework principal. Ele é responsável por automatizar o cálculo de economia potencial para funcionários em programas de benefícios corporativos, como vales-refeição, vales-combustível e outros benefícios, integrando-se com um banco de dados **Oracle** (versão JDBC 19.3.0.0). O sistema utiliza **Spring Data JPA** para persistência de dados, **Spring Web** para exposição de APIs REST, e **Spring Boot Actuator** para monitoramento e métricas de saúde da aplicação.

## Repositório
- **GitHub**: https://github.com/SemParar-B2B/BS-vbnet-poupador-calcula-economia
- **Deploy**: Via Nexus (https://get-nexus.fleetcor.com.br)

## Status Atual
O sistema opera em produção com jobs agendados para processamento assíncrono, suportando migrações e testes para manter compatibilidade com versões anteriores.
