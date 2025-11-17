# Guia de Teste e Validação para o Sistema de Cálculo do Poupador

## Projeto: BS-vbnet-poupador-calcula-economia
### Desenvolvedor: Wesley Taumaturgo
#### Data: 14 de Novembro de 2025 (Atualizado)

---

## Visão Geral do Sistema

O **BS-vbnet-poupador-calcula-economia** é um sistema monolítico desenvolvido em **Java 21** utilizando **Spring Boot 3.2.5** como framework principal. Ele é responsável por automatizar o cálculo de economia potencial para funcionários em programas de benefícios corporativos, como vales-refeição, vales-combustível e outros benefícios, integrando-se com um banco de dados **Oracle** (versão JDBC 19.3.0.0). O sistema utiliza **Spring Data JPA** para persistência de dados, **Spring Web** para exposição de APIs REST, e **Spring Boot Actuator** para monitoramento e métricas de saúde da aplicação.

### Propósito e Valor de Negócio
O sistema visa otimizar o uso de benefícios corporativos, calculando economias ao comparar tarifas e condições comerciais, permitindo que funcionários maximizem seus benefícios. Ele processa pedidos de economia, valida elegibilidade de funcionários, calcula saldos e quotas diárias/mensais, e garante a integridade dos cálculos através de regras de negócio específicas. Isso resulta em economia financeira para empresas e funcionários, reduzindo custos operacionais e melhorando a satisfação dos usuários.

### Arquitetura e Tecnologias
- **Tipo**: Monolito (aplicação única e autocontida).
- **Linguagem**: Java 21.
- **Framework**: Spring Boot 3.2.5.
- **Banco de Dados**: Oracle Database.
- **Build Tool**: Maven.
- **Dependências Principais**:
  - Spring Boot Starter Data JPA.
  - Spring Boot Starter Web.
  - Spring Boot Starter Actuator.
  - Oracle JDBC Driver (19.3.0.0).
  - XStream (1.4.20) para serialização XML.
  - Apache Commons Lang3, Collections4, Math3 para utilitários.
  - Google Guava (33.1.0-jre) para coleções e utilitários.
  - Gson para JSON.
  - Jakarta XML Bind API para XML.
  - SpringDoc OpenAPI (2.3.0) para documentação de APIs.
  - Swagger Annotations (1.6.8) e Models (2.2.21) para suporte a OpenAPI.
- **Repositório**: GitHub (https://github.com/SemParar-B2B/BS-vbnet-poupador-calcula-economia).
- **Deploy**: Via Nexus (https://get-nexus.fleetcor.com.br).

### Estrutura da Aplicação
A aplicação é organizada em pacotes modulares para facilitar manutenção e escalabilidade:
- **business**: Lógica de negócio principal, incluindo cálculos mensais, condições comerciais e gestão de economia (ex: CalculoMensal, CondicaoComercialBusiness).
- **calculo**: Algoritmos específicos para cálculos de poupador e TACOM (ex: CalculoPoupadorTacom).
- **controller**: Controladores REST para exposição de APIs.
- **dto**: Objetos de transferência de dados.
- **enums**: Enumerações para constantes (ex: tipos de taxa).
- **exceptions**: Tratamento de exceções customizadas (ex: Excecoes).
- **executor**: Execução de tarefas assíncronas (ex: ExecutaProcessaPedido).
- **interfaces**: Contratos e interfaces para desacoplamento.
- **job**: Jobs agendados para processamento periódico (ex: classes em job/).
- **model**: Entidades JPA mapeadas para o banco Oracle (ex: Periodo, QuotaDiaria).
- **repository**: Repositórios para acesso a dados.
- **service**: Serviços de negócio e integração (ex: PedidoEconomiaBusiness).
- **util**: Utilitários diversos (ex: Parameters).
- **validation**: Validações de regras de negócio (ex: Regra).

### Testes e Qualidade
O projeto inclui uma suíte robusta de testes compatível com Java 21:
- **JUnit 5** (junit-jupiter) e **Mockito** (mockito-core, mockito-junit-jupiter) para testes unitários.
- **TestContainers** com Oracle Free para testes de integração (testcontainers, junit-jupiter, oracle-free).
- **H2 Database** para testes leves.
- **AssertJ** para asserções fluentes.
- **WireMock** (3.4.2) para mock de serviços externos.
- **Spring Boot Test** para testes de contexto.
- **JSON Path** para validação de respostas JSON.
- Plugins Maven Surefire (3.2.5) para testes unitários e Failsafe (3.2.5) para integração, com configurações específicas para Java 21 (argLine com --add-opens para módulos), perfis de teste (test, integration-test), e encoding UTF-8.

### Funcionalidades Chave
- **Cálculo de Economia**: Realiza cálculos complexos de poupador, incluindo taxa 63 para Poupador VB, quebra de taxas por produto/subproduto, e ajustes baseados em condições comerciais.
- **Processamento de Pedidos**: Gerencia pedidos de economia de forma assíncrona, com suporte a reprocessamento e validação de integridade, através de fases sequenciais (definição de sequência, criação de novo pedido, cálculo de pedido, cálculo de taxas e finalização).
- **Gestão de Funcionários e Saldos**: Verifica elegibilidade de funcionários, calcula saldos finais e quotas (diárias e por pedido), integrando com sistemas legados via EJBs, aplicando regras de negócio como exceções para funcionários acima de 60 anos.
- **APIs REST**: Expõe endpoints para cálculo simples, verificação de elegibilidade, reprocessamento de pedidos e configuração, documentados com OpenAPI/Swagger.
- **Jobs Agendados**: Inclui jobs para processamento automático de pedidos em lote, utilizando execução assíncrona para performance, configurados via cron expressions.
- **Validação e Exceções**: Implementa regras de validação rigorosas e tratamento de exceções para garantir consistência dos dados, com logging detalhado de configurações e propriedades do sistema.
- **Monitoramento**: Via Spring Boot Actuator, com métricas, health checks e endpoints de gerenciamento.

Essa arquitetura monolítica garante simplicidade de deploy e manutenção, enquanto as tecnologias modernas asseguram performance e confiabilidade em um ambiente Oracle. O sistema opera em produção com jobs agendados para processamento assíncrono, suportando migrações e testes para manter compatibilidade com versões anteriores.

---

## Funcionamento Atual do Teste (Fluxo Manual)

# Como Funciona os  Teste para Cálculo Poupador


1. Selecionar pedidos de teste para execução.
- Fazer backup da tabela pedido_economia
  ```sql
  create table pedido_economia_backup TABLESPACE TS_DAD_SIGUSER_2M_01 as
  select ecn.* from pedido_economia ecn;
   ```
- conferir quantidade de registros no backup
  ```sql
  select count(*) from pedido_economia_backup ecn;
   ```

- Separar os pedidos que serão reprocessados, será nossa referência para comparação.
  ```sql
      create table pedido_economia_original as
      select ecn.*
      from pedido_economia_backup ecn, pedido peo, pedido pee
      where ecn.id_pedido_ori = peo.id_pedido_ped
      and ecn.id_pedido_ecn = pee.id_pedido_ped(+)
      and pee.ob_vtonli_ped.dt_pagrea_ped is not null
      and peo.dt_pedido_ped >= TO_DATE('01/06/2024 00:00:00', 'DD/MM/YYYY HH24:MI:SS')
      and peo.dt_pedido_ped < TO_DATE('30/06/2024 23:59:59', 'DD/MM/YYYY HH24:MI:SS')
  ```

- Altera data do pedido para poder ter economia
  ```sql
      UPDATE pedido peo
    SET
    -- Novo início = DT_PEDIDO_PED + 2 meses
    peo.ob_vtonli_ped.dt_inicio_ped = ADD_MONTHS(peo.dt_pedido_ped, 2),

        -- Novo fim = último dia do mês da nova data de início
        peo.ob_vtonli_ped.dt_finals_ped = LAST_DAY(ADD_MONTHS(peo.dt_pedido_ped, 2))
    WHERE
    1 =1
    -- peo.ob_vtonli_ped.dt_inicio_ped BETWEEN DATE '2025-10-01' AND DATE '2025-10-20'
    AND peo.ID_PEDIDO_PED IN (
    SELECT p.id_pedido_ori
    FROM pedido_economia_original p
    );
  ```

- Apagar totalmente a pedido_economia para facilitar análise.
  ```sql
     alter table PEDIDO_ECONOMIA_SALDO_FUNC disable constraint FK_PEF_PEE_ID_PEDIDO_ECONOMIA;

     alter table PEDIDO_ECONOMIA_PROCESSA  disable constraint FK_PEP_PED_ID_PEDIDO_ECN;

     truncate table pedido_economia_saldo_func;
     truncate table pedido_economia;

     alter table PEDIDO_ECONOMIA_SALDO_FUNC enable constraint FK_PEF_PEE_ID_PEDIDO_ECONOMIA;

     alter table PEDIDO_ECONOMIA_PROCESSA  enable constraint FK_PEP_PED_ID_PEDIDO_ECN;
  ```
    - Voltar para pedido economia somente os pedidos que selecionados reprocessados
      ```sql
              INSERT INTO PEDIDO_ECONOMIA
              (ID_PEDIDO_ECONOMIA,
              ID_PEDIDO_ORI,
              ID_PEDIDO_ECN,
              FL_STATUS,
              FL_CLIENTE_RETORNO,
              FL_STATUS_PROCESSAMENTO,
              DT_INICIO_PROCESSAMENTO,
              DT_TERMINO_PROCESSAMENTO,
              CD_PRIORIDADE,
              DS_MAQUINA,
              FL_REPRIORIZADO,
              DT_ULTIMA_ATIVIDADE,
              DS_MAQUINA_AGENDAMENTO,
              DS_SEQEXE_ECN)
              SELECT ENC.ID_PEDIDO_ECONOMIA,
              ENC.ID_PEDIDO_ORI,
              ENC.ID_PEDIDO_ECN,
              ENC.FL_STATUS,
              ENC.FL_CLIENTE_RETORNO,
              ENC.FL_STATUS_PROCESSAMENTO,
              ENC.DT_INICIO_PROCESSAMENTO,
              ENC.DT_TERMINO_PROCESSAMENTO,
              ENC.CD_PRIORIDADE,
              ENC.DS_MAQUINA,
              ENC.FL_REPRIORIZADO,
              ENC.DT_ULTIMA_ATIVIDADE,
              ENC.DS_MAQUINA_AGENDAMENTO,
              ENC.DS_SEQEXE_ECN
              FROM pedido_economia_original ENC;
              COMMIT;
      ```
- Conferir os pedidos que serão reprocessados. A data de inicio e fim do pedido deve estar correta.
  ```sql
      select   peo.ob_vtonli_ped.dt_inicio_ped,  peo.ob_vtonli_ped.dt_finals_ped,  peo.*
      from  pedido peo
      where  peo.ID_PEDIDO_PED in(select p.id_pedido_ori from pedido_economia_original p );
    ```

- conferir quantidade de registros na tabela pedido_economia. A quantidade de registros deve ser igual a quantidade de pedidos selecionados para reprocessar.
  ```sql
    SELECT * FROM PEDIDO_ECONOMIA p;
   ```

- conferir quantidade de registros na tabela pedido_economia_saldo_func. A quantidade de registros deve ser zero.
  ```sql
    SELECT * from pedido_economia_saldo_func f ;
   ```

2. Reprocessar os pedidos selecionados.
    - Executar o script abaixo para reprocessar os pedidos selecionados.
      ```sql
                 DECLARE
       p_cd_ret        VARCHAR2(100);
       p_ds_ret        VARCHAR2(300);
       v_fl_fasepe_fnp VARCHAR2(3);
       v_total         NUMBER;
       v_metade        NUMBER;
       BEGIN

       -- PROCESSAMENTO PRINCIPAL
       FOR i IN (
       SELECT

         e.id_pedido_ori, e.id_pedido_ecn, e.id_pedido_economia
        FROM pedido_economia e
      ) LOOP

        IF i.id_pedido_economia IS NOT NULL THEN
           DELETE FROM pedido_economia_saldo_func pes
            WHERE pes.id_pedido_economia = i.id_pedido_economia;
        END IF;

        IF i.id_pedido_ecn IS NOT NULL THEN
            UPDATE pedido ped
               SET ped.id_fnegpe_fnp = 5
             WHERE ped.id_pedido_ped = i.id_pedido_ecn;
        END IF;

        DELETE FROM pedido_economia_saldo_func pes
         WHERE pes.id_pedido_economia = i.id_pedido_economia;

        UPDATE GERA_PEDIDO GER
           SET GER.ID_PEDIDO_PED = i.ID_PEDIDO_ORI
         WHERE GER.ID_PEDIDO_PED = i.ID_PEDIDO_ECN;

        UPDATE pedido ped
           SET ped.id_fnegpe_fnp = 2
         WHERE ped.id_pedido_ped = i.id_pedido_ori;

        UPDATE pedido_economia pe
           SET pe.id_pedido_ecn            = NULL,
               pe.fl_status                = 'S',
               pe.fl_cliente_retorno       = 'N',
               pe.fl_status_processamento  = NULL,
               pe.dt_inicio_processamento  = NULL,
               pe.dt_termino_processamento = NULL,
               pe.dt_ultima_atividade      = NULL,
               pe.ds_maquina               = 'MAQMM'
         WHERE pe.id_pedido_economia = i.id_pedido_economia;

        COMMIT;
       END LOOP;
    
       -- DIVISÃO DOS PEDIDOS ENTRE MAQ1 E MAQ2
       SELECT COUNT(*) INTO v_total
       FROM pedido_economia
       WHERE fl_status = 'S';

       v_metade := CEIL(v_total / 2);

       -- Atualiza a primeira metade com MAQ1
       MERGE INTO pedido_economia pe
       USING (
       SELECT id_pedido_economia
       FROM (
       SELECT id_pedido_economia,
       ROW_NUMBER() OVER (ORDER BY id_pedido_economia) AS rn
       FROM pedido_economia
       WHERE fl_status = 'S'
       )
       WHERE rn <= v_metade
       ) dados
       ON (pe.id_pedido_economia = dados.id_pedido_economia)
       WHEN MATCHED THEN
       UPDATE SET pe.ds_maquina = 'MAQMM2';

       -- Atualiza a segunda metade com MAQ2
       MERGE INTO pedido_economia pe
       USING (
       SELECT id_pedido_economia
       FROM (
       SELECT id_pedido_economia,
       ROW_NUMBER() OVER (ORDER BY id_pedido_economia) AS rn
       FROM pedido_economia
       WHERE fl_status = 'S'
       )
       WHERE rn > v_metade
       ) dados
       ON (pe.id_pedido_economia = dados.id_pedido_economia)
       WHEN MATCHED THEN
       UPDATE SET pe.ds_maquina = 'MAQMM3';

       COMMIT;
       END;
       /
      ```
3.  A aplicação BS-vbnet-poupador-calcula-economia executar o cálculo do poupador com os pedidos reprocessados com branch master (versão em produção).
4.  Criar backup das tabelas para comparar os valores obtidos.
    ```sql
        create table pedido_economia_ori as
        select ecn.*
        from pedido_economia ecn;

        create table pedido_economia_saldo_func_ori as
        select ecn.*
        from pedido_economia_saldo_func ecn;

        truncate table pedido_economia_saldo_func;

        create table tmp_pedidos_gabarito as
        select ecn.id_pedido_economia, ecn.id_pedido_ori, ecn.id_pedido_ecn
        from pedido_economia ecn;
    ```
4. Reprocessar os pedidos novamente apos criar as tabelas de backup.
    - Executar o script abaixo para reprocessar os pedidos selecionados.
       ```sql
                 DECLARE
       p_cd_ret        VARCHAR2(100);
       p_ds_ret        VARCHAR2(300);
       v_fl_fasepe_fnp VARCHAR2(3);
       v_total         NUMBER;
       v_metade        NUMBER;
       BEGIN

       -- PROCESSAMENTO PRINCIPAL
       FOR i IN (
       SELECT

         e.id_pedido_ori, e.id_pedido_ecn, e.id_pedido_economia
        FROM pedido_economia e
      ) LOOP

        IF i.id_pedido_economia IS NOT NULL THEN
           DELETE FROM pedido_economia_saldo_func pes
            WHERE pes.id_pedido_economia = i.id_pedido_economia;
        END IF;

        IF i.id_pedido_ecn IS NOT NULL THEN
            UPDATE pedido ped
               SET ped.id_fnegpe_fnp = 5
             WHERE ped.id_pedido_ped = i.id_pedido_ecn;
        END IF;

        DELETE FROM pedido_economia_saldo_func pes
         WHERE pes.id_pedido_economia = i.id_pedido_economia;

        UPDATE GERA_PEDIDO GER
           SET GER.ID_PEDIDO_PED = i.ID_PEDIDO_ORI
         WHERE GER.ID_PEDIDO_PED = i.ID_PEDIDO_ECN;

        UPDATE pedido ped
           SET ped.id_fnegpe_fnp = 2
         WHERE ped.id_pedido_ped = i.id_pedido_ori;

        UPDATE pedido_economia pe
           SET pe.id_pedido_ecn            = NULL,
               pe.fl_status                = 'S',
               pe.fl_cliente_retorno       = 'N',
               pe.fl_status_processamento  = NULL,
               pe.dt_inicio_processamento  = NULL,
               pe.dt_termino_processamento = NULL,
               pe.dt_ultima_atividade      = NULL,
               pe.ds_maquina               = 'MAQMM'
         WHERE pe.id_pedido_economia = i.id_pedido_economia;

        COMMIT;
       END LOOP;

       -- DIVISÃO DOS PEDIDOS ENTRE MAQ1 E MAQ2
       SELECT COUNT(*) INTO v_total
       FROM pedido_economia
       WHERE fl_status = 'S';

       v_metade := CEIL(v_total / 2);

       -- Atualiza a primeira metade com MAQ1
       MERGE INTO pedido_economia pe
       USING (
       SELECT id_pedido_economia
       FROM (
       SELECT id_pedido_economia,
       ROW_NUMBER() OVER (ORDER BY id_pedido_economia) AS rn
       FROM pedido_economia
       WHERE fl_status = 'S'
       )
       WHERE rn <= v_metade
       ) dados
       ON (pe.id_pedido_economia = dados.id_pedido_economia)
       WHEN MATCHED THEN
       UPDATE SET pe.ds_maquina = 'MAQMM2';

       -- Atualiza a segunda metade com MAQ2
       MERGE INTO pedido_economia pe
       USING (
       SELECT id_pedido_economia
       FROM (
       SELECT id_pedido_economia,
       ROW_NUMBER() OVER (ORDER BY id_pedido_economia) AS rn
       FROM pedido_economia
       WHERE fl_status = 'S'
       )
       WHERE rn > v_metade
       ) dados
       ON (pe.id_pedido_economia = dados.id_pedido_economia)
       WHEN MATCHED THEN
       UPDATE SET pe.ds_maquina = 'MAQMM3';

       COMMIT;
       END;
       /
      ```
5. A aplicação BS-vbnet-poupador-calcula-economia executar o cálculo do poupador com os pedidos reprocessados com branch desenvolvimento (versão com alteração).
6. Apos executar o cálculo do poupador na versão da branch desenvolvimento (versão com alteração), comparar os resultados obtidos com os valores do backup criado anteriormente.
    - Comparar os pedidos reprocessados com os pedidos.
       ```sql
                  select T.id_pedido_economia,
                      T.id_pedido_ori,
                      T.id_pedido_ecn_prd,
                      T.id_pedido_ecn_dev,
                      CASE
                        WHEN (T.ECONOMIA_PRD = T.ECONOMIA_DEV OR
                             (T.ECONOMIA_PRD IS NULL AND T.ECONOMIA_DEV IS NULL)) THEN
                         'OK'
                        ELSE
                         'DIFF'
                      END ECONOMIA,
                      CASE
                        WHEN (T.taxa_63_prd = T.taxa_63_dev OR
                             (T.taxa_63_prd IS NULL AND T.taxa_63_dev IS NULL)) THEN
                         'OK'
                        ELSE
                         'DIFF'
                      END taxa_63,
                      CASE
                        WHEN (T.condicao_taxa_63_prd = T.condicao_taxa_63_dev OR
                             (T.condicao_taxa_63_prd IS NULL AND
                             T.condicao_taxa_63_dev IS NULL)) THEN
                         'OK'
                        ELSE
                         'DIFF'
                      END condicao_taxa_63,
                      CASE
                        WHEN (T.taxa_170_prd = T.taxa_170_dev OR
                             (T.taxa_170_prd IS NULL AND T.taxa_170_dev IS NULL)) THEN
                         'OK'
                        ELSE
                         'DIFF'
                      END taxa_170,
                      CASE
                        WHEN (T.condicao_taxa_170_prd = T.condicao_taxa_170_dev OR
                             (T.condicao_taxa_170_prd IS NULL AND
                             T.condicao_taxa_170_dev IS NULL)) THEN
                         'OK'
                        ELSE
                         'DIFF'
                      END condicao_taxa_170,
                      (select round(SUM(plo.vl_unitar_plo * plo.qt_nobloc_plo *
                                        plo.qt_insumo_plo),
                                    2) total
                         from pedido_local plo, insumo ins, produto pro
                        where plo.id_insumo_ins = ins.id_insumo_ins
                          and ins.id_produt_pro = pro.id_produt_pro
                          and pro.id_negemp_nem = 1
                          and pro.ds_sigla_pro = 'VT'
                          and plo.id_pedido_ped = T.id_pedido_ori) VOLUME_ORI,
                      T.ECONOMIA_PRD,
                      T.ECONOMIA_DEV,
                      T.ECONOMIA_DEV - T.ECONOMIA_PRD DIFF_ECO_PRD_DEV,
                      (select sum(sal.vl_minimo_emissor) from pedido_economia_saldo_func sal where sal.id_pedido_economia = T.id_pedido_economia) SOMA_MINIMO,
                      T.taxa_63_prd,
                      T.taxa_63_dev,
                      T.condicao_taxa_63_prd,
                      T.condicao_taxa_63_dev,
                      T.taxa_170_prd,
                      T.taxa_170_dev,
                      T.condicao_taxa_170_prd,
                      T.condicao_taxa_170_dev,
                      (select LISTAGG(ds_sigla_pro, ', ') WITHIN GROUP(ORDER BY ds_sigla_pro DESC) "PRODUTO"
                         from (select distinct pro.ds_sigla_pro, plo.id_pedido_ped
                                 from pedido_local plo, insumo ins, produto pro
                                where plo.id_insumo_ins = ins.id_insumo_ins
                                  and ins.id_produt_pro = pro.id_produt_pro
                                  and pro.id_negemp_nem = 1) T
                        where t.id_pedido_ped = T.id_pedido_ori) PRODUTOS,
                      (select LISTAGG(id_emisso_emi, ', ') WITHIN GROUP(ORDER BY id_emisso_emi DESC) "EMISSOR"
                         from (select distinct emi.id_emisso_emi, plo.id_pedido_ped
                                 from pedido_local plo, emissor_insumo emi
                                where plo.id_insumo_ins = emi.id_insumo_ins) E
                        where E.id_pedido_ped = t.id_pedido_ori) emissores
                         from (select tmp.id_pedido_economia,
                         tmp.id_pedido_ori,
                         eco.id_pedido_ecn      id_pedido_ecn_prd,
                         ecn.id_pedido_ecn      id_pedido_ecn_dev,
                         -- Prd
                         pedp.economia          economia_prd,
                         pedp.taxa_63           taxa_63_prd,
                         pedp.condicao_taxa_63  condicao_taxa_63_prd,
                         pedp.taxa_170          taxa_170_prd,
                         pedp.condicao_taxa_170 condicao_taxa_170_prd,
                         -- Dev
                         pedd.economia          economia_dev,
                         pedd.taxa_63           taxa_63_dev,
                         pedd.condicao_taxa_63  condicao_taxa_63_dev,
                         pedd.taxa_170          taxa_170_dev,
                         pedd.condicao_taxa_170 condicao_taxa_170_dev
                         from tmp_pedidos_gabarito tmp,
                         pedido_economia ecn,
                         pedido_economia_ori eco,
                         (select peo.vl_totins_ped - pee.vl_totins_ped economia,
                         (select ttp.vl_taxped_txp
                         from taxa_pedido ttp
                         where ttp.id_pedido_ped = pee.id_pedido_ped
                         and ttp.id_taxtip_ttp = 63) taxa_63,
                         (select ttp.nr_condic_txp
                         from taxa_pedido ttp
                         where ttp.id_pedido_ped = pee.id_pedido_ped
                         and ttp.id_taxtip_ttp = 63) condicao_taxa_63,
                         (select ttp.vl_taxped_txp
                         from taxa_pedido ttp
                         where ttp.id_pedido_ped = pee.id_pedido_ped
                         and ttp.id_taxtip_ttp = 170) taxa_170,
                         (select ttp.nr_condic_txp
                         from taxa_pedido ttp
                         where ttp.id_pedido_ped = pee.id_pedido_ped
                         and ttp.id_taxtip_ttp = 170) condicao_taxa_170,
                         peo.id_pedido_ped id_pedido_ped_ori,
                         pee.id_pedido_ped id_pedido_ped_ecn
                         from pedido peo, pedido pee) pedp,
                         (select peo.vl_totins_ped - pee.vl_totins_ped economia,
                         (select ttp.vl_taxped_txp
                         from taxa_pedido ttp
                         where ttp.id_pedido_ped = pee.id_pedido_ped
                         and ttp.id_taxtip_ttp = 63) taxa_63,
                         (select ttp.nr_condic_txp
                         from taxa_pedido ttp
                         where ttp.id_pedido_ped = pee.id_pedido_ped
                         and ttp.id_taxtip_ttp = 63) condicao_taxa_63,
                         (select ttp.vl_taxped_txp
                         from taxa_pedido ttp
                         where ttp.id_pedido_ped = pee.id_pedido_ped
                         and ttp.id_taxtip_ttp = 170) taxa_170,
                         (select ttp.nr_condic_txp
                         from taxa_pedido ttp
                         where ttp.id_pedido_ped = pee.id_pedido_ped
                         and ttp.id_taxtip_ttp = 170) condicao_taxa_170,
                         peo.id_pedido_ped id_pedido_ped_ori,
                         pee.id_pedido_ped id_pedido_ped_ecn
                         from pedido peo, pedido pee) pedd
                         where tmp.id_pedido_economia = eco.id_pedido_economia
                         and tmp.id_pedido_economia = ecn.id_pedido_economia
                         and eco.id_pedido_ori = pedp.id_pedido_ped_ori
                         and eco.id_pedido_ecn = pedp.id_pedido_ped_ecn
                         and ecn.id_pedido_ori = pedd.id_pedido_ped_ori
                         and ecn.id_pedido_ecn = pedd.id_pedido_ped_ecn
                         ) T

                         ORDER BY (CASE
                 WHEN (T.ECONOMIA_PRD = T.ECONOMIA_DEV OR
                     (T.ECONOMIA_PRD IS NULL AND T.ECONOMIA_DEV IS NULL)) THEN
                     'OK'
                     ELSE
                     'ERRO'
                     END);
            ```
    - Caso der alguma diferença entre os pedidos, verificar os valores dos funcionários. com os Ids dos pedidos com diferença:  ori.id_pedido_ped (id pedido original), and prd.id_pedido_ped (id pedido prod ), dev.id_pedido_ped (id pedido dev)

        ```sql
                 select dev.id_funcio_fun,
                   dev.cd_numcpf_int,
                   dev.id_insumo_ins,
                   ori.valor valor_ori,
                   prd.valor valor_prd,
                   dev.valor valor_dev,
                   CASE
                   WHEN (dev.valor = prd.valor) THEN
                   'OK'
                   ELSE
                   'DIFF'
                   END DIFF_DEV_PRD,
                   prd.id_emisso_emi,
                   ori.id_pedido_ped id_pedido_ori,
                   prd.id_pedido_ped id_pedido_prd,
                   dev.id_pedido_ped id_pedido_dev,
                   NVL(ori.valor,0) - NVL(prd.valor,0) valor_economia_prod,
                   NVL(ori.valor,0) - NVL(dev.valor,0) valor_economia_dev,
                   ((NVL(ori.valor,0) - NVL(prd.valor,0)) / NVL(ori.valor,0)) * 15 AS porcentagem_economia_prod,
                   ((NVL(ori.valor,0) - NVL(dev.valor,0)) / NVL(ori.valor,0)) * 15 AS porcentagem_economia_dev,
                   NVL(ori.valor,0) * 0.15 AS valor_15_porcento
                   from (select inm.id_funcio_fun,
                   inm.cd_numcpf_int,
                   ind.id_insumo_ins,
                   sum(ind.vl_unitar_ind * ind.qt_nobloc_ind * ind.qt_insumo_ind) valor,
                   inm.id_pedido_ped,
                   eni.id_emisso_emi
                   from interface_master  inm,
                   interface_detalhe ind,
                   emissor_insumo    eni
                   where inm.id_funcio_int = ind.id_funcio_int
                   and ind.id_insumo_ins = eni.id_insumo_ins
                   group by inm.id_funcio_fun,
                   inm.cd_numcpf_int,
                   ind.id_insumo_ins,
                   inm.id_pedido_ped,
                   eni.id_emisso_emi) ori,
                   (select inm.id_funcio_fun,
                   inm.cd_numcpf_int,
                   ind.id_insumo_ins,
                   sum(ind.vl_unitar_ind * ind.qt_nobloc_ind * ind.qt_insumo_ind) valor,
                   inm.id_pedido_ped,
                   eni.id_emisso_emi
                   from interface_master  inm,
                   interface_detalhe ind,
                   emissor_insumo    eni
                   where inm.id_funcio_int = ind.id_funcio_int
                   and ind.id_insumo_ins = eni.id_insumo_ins
                   group by inm.id_funcio_fun,
                   inm.cd_numcpf_int,
                   ind.id_insumo_ins,
                   inm.id_pedido_ped,
                   eni.id_emisso_emi) dev,
                   (select inm.id_funcio_fun,
                   inm.cd_numcpf_int,
                   ind.id_insumo_ins,
                   sum(ind.vl_unitar_ind * ind.qt_nobloc_ind * ind.qt_insumo_ind) valor,
                   inm.id_pedido_ped,
                   eni.id_emisso_emi
                   from interface_master  inm,
                   interface_detalhe ind,
                   emissor_insumo    eni
                   where inm.id_funcio_int = ind.id_funcio_int
                   and ind.id_insumo_ins = eni.id_insumo_ins
                   group by inm.id_funcio_fun,
                   inm.cd_numcpf_int,
                   ind.id_insumo_ins,
                   inm.id_pedido_ped,
                   eni.id_emisso_emi) prd
                   where dev.id_funcio_fun = prd.id_funcio_fun
                   and dev.id_insumo_ins = prd.id_insumo_ins
                   and dev.id_funcio_fun = ori.id_funcio_fun
                   and dev.id_insumo_ins = ori.id_insumo_ins
                   and ori.id_pedido_ped = 14964394
                   and prd.id_pedido_ped = 15007737
                   and dev.id_pedido_ped = 15025161
                   -- and dev.id_funcio_fun = 12081667
                   ORDER BY (CASE
                   WHEN (dev.valor = prd.valor) THEN
                   'OK'
                   ELSE
                   'DIFF'
                   END);
             ```
    - Comparar total de valores entre ind, plo e tdt. tem que bater todos os valores.

         ```sql
                   select emi.id_emisso_emi,
                   sum(ind.qt_insumo_ind * ind.vl_unitar_ind * ind.qt_nobloc_ind) total
                 from interface_detalhe ind,
                   emissor_insumo    emi,
                   insumo_negocio    ing,
                   insumo_tipo       itp
                   where ind.id_insumo_ins = emi.id_insumo_ins
                   and ind.id_insumo_ins = ing.id_insumo_ins
                   and ing.id_instip_itp = itp.id_instip_itp
                   and itp.fl_instip_itp = 'E'
                   and ind.id_pedido_ped = 12499466
                   group by emi.id_emisso_emi
                   order by emi.id_emisso_emi;

               select emi.id_emisso_emi,
                 sum(plo.qt_insumo_plo * plo.vl_unitar_plo * plo.qt_nobloc_plo) total
                 from pedido_local   plo,
                 emissor_insumo emi,
                 insumo_negocio ing,
                 insumo_tipo    itp
                 where plo.id_insumo_ins = emi.id_insumo_ins
                 and plo.id_insumo_ins = ing.id_insumo_ins
                 and ing.id_instip_itp = itp.id_instip_itp
                 and itp.fl_instip_itp = 'E'
                 and plo.id_pedido_ped = 12499466
                 group by emi.id_emisso_emi
                 order by emi.id_emisso_emi;
           ```

---


## Critérios de Sucesso
### Resultado Esperado
- Os valores das taxas devem ser idênticos nas duas versões.
- Os valores de economia realizada devem ser idênticos nas duas versões.
- Os valores totais de ind, plo e tdt devem ser iguais.
- Não deve haver diferenças entre os valores dos funcionários.
- Não deve haver diferenças entre os pedidos reprocessados.

## Tabelas Envolvidas
- pedido_economia
```sql
CREATE TABLE "SIG_USER"."PEDIDO_ECONOMIA"
   (	"ID_PEDIDO_ECONOMIA" NUMBER NOT NULL ENABLE,
	"ID_PEDIDO_ORI" NUMBER NOT NULL ENABLE,
	"ID_PEDIDO_ECN" NUMBER,
	"FL_STATUS" VARCHAR2(1) NOT NULL ENABLE,
	"FL_CLIENTE_RETORNO" VARCHAR2(1) DEFAULT 'N' NOT NULL ENABLE,
	"FL_STATUS_PROCESSAMENTO" VARCHAR2(1),
	"DT_INICIO_PROCESSAMENTO" DATE,
	"DT_TERMINO_PROCESSAMENTO" DATE,
	"CD_PRIORIDADE" NUMBER,
	"DS_MAQUINA" VARCHAR2(30),
	"FL_REPRIORIZADO" CHAR(1),
	"DT_ULTIMA_ATIVIDADE" DATE,
	"DS_MAQUINA_AGENDAMENTO" VARCHAR2(30),
	"DS_SEQEXE_ECN" VARCHAR2(50),
	"ID_USUARI_USU" NUMBER,
	"DATA_LIBERACAO" DATE,
	"ID_PEDECO_MOT" NUMBER,
	"DS_PEDECO_MOT_OUTRO" VARCHAR2(255),
	 CONSTRAINT "PK_PEDIDO_ECONOMIA" PRIMARY KEY ("ID_PEDIDO_ECONOMIA")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01"  ENABLE,
	 SUPPLEMENTAL LOG DATA (ALL) COLUMNS,
	 SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS,
	 CONSTRAINT "FK_PEE_PED_ID_PEDIDO_ORI" FOREIGN KEY ("ID_PEDIDO_ORI")
	  REFERENCES "SIG_USER"."PEDIDO" ("ID_PEDIDO_PED") ENABLE,
	 CONSTRAINT "FK_PEE_PED_ID_PEDIDO_ECN" FOREIGN KEY ("ID_PEDIDO_ECN")
	  REFERENCES "SIG_USER"."PEDIDO" ("ID_PEDIDO_PED") ENABLE,
	 CONSTRAINT "FK_PEE_STA_FL_STATUS" FOREIGN KEY ("FL_STATUS")
	  REFERENCES "SIG_USER"."PEDIDO_ECONOMIA_STATUS" ("FL_STATUS") ENABLE,
	 CONSTRAINT "FK_PEDIDO_ECONOMIA_MOTIVO" FOREIGN KEY ("ID_PEDECO_MOT")
	  REFERENCES "SIG_USER"."PEDIDO_ECONOMIA_MOTIVO" ("ID_PEDECO_MOT") ENABLE,
	 CONSTRAINT "FK_PED_ECO_ID_USUARI_USU" FOREIGN KEY ("ID_USUARI_USU")
	  REFERENCES "SIG_USER"."USUARIO" ("ID_USUARI_USU") ENABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 2097152 NEXT 2097152 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_2M_01" ;

CREATE INDEX "SIG_USER"."IDX$$_023F003B" ON "SIG_USER"."PEDIDO_ECONOMIA" (NVL("ID_PEDIDO_ECN","ID_PEDIDO_ORI"))
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_11030001" ON "SIG_USER"."PEDIDO_ECONOMIA" ("DS_MAQUINA")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE INDEX "SIG_USER"."IK_PEDIDO_ECN_FL_STATUS" ON "SIG_USER"."PEDIDO_ECONOMIA" ("FL_STATUS")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IK_PEDIDO_ECN_ID_PEDIDO_ECN" ON "SIG_USER"."PEDIDO_ECONOMIA" ("ID_PEDIDO_ECN")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE INDEX "SIG_USER"."IK_PEDIDO_ECN_ID_PEDIDO_ORI" ON "SIG_USER"."PEDIDO_ECONOMIA" ("ID_PEDIDO_ORI")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."PK_PEDIDO_ECONOMIA" ON "SIG_USER"."PEDIDO_ECONOMIA" ("ID_PEDIDO_ECONOMIA")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;

COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.FL_STATUS_PROCESSAMENTO IS 'Inicializa processamento com nulo. Depois atualiza para o mesmo valor de FL_STATUS';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.DT_INICIO_PROCESSAMENTO IS 'Data de inicio do processamento';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.DT_TERMINO_PROCESSAMENTO IS 'Data de termino do processamento';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.CD_PRIORIDADE IS 'Prioridade de execucao do pedido';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.DS_MAQUINA IS 'Hostname da maquina que processa o pedido';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.FL_REPRIORIZADO IS 'Indica se o pedido ja foi repriorizado';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.DT_ULTIMA_ATIVIDADE IS 'Data de ultima atividade do pedido';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.DS_MAQUINA_AGENDAMENTO IS 'Hostname da maquina que vai processar a proxima fase do pedido em caso de agendamento de redirecionamento';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.DS_SEQEXE_ECN IS 'Sequência de executação das fases de economia';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.ID_USUARI_USU IS 'Usuário que fez a liberação do pedido';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.DATA_LIBERACAO IS 'Data de liberação do pedido';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.ID_PEDECO_MOT IS 'Motivo de liberação do pedido';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA.DS_PEDECO_MOT_OUTRO IS 'Outro Motivo de liberação do pedido';
```
- pedido_economia_saldo_func
```sql
CREATE TABLE "SIG_USER"."PEDIDO_ECONOMIA_SALDO_FUNC"
   (	"ID_PEDIDO_ECONOMIA_SALDO_FUNC" NUMBER NOT NULL ENABLE,
	"ID_PEDIDO_ECONOMIA" NUMBER NOT NULL ENABLE,
	"ID_EMISSO_EMI" NUMBER NOT NULL ENABLE,
	"ID_FUNCIO_FUN" NUMBER NOT NULL ENABLE,
	"DT_PESQUISA" DATE,
	"VL_SALDO_CARTAO" NUMBER,
	"DT_ULTIMA_UTILIZACAO" DATE,
	"VL_SALDO_CALCULO" NUMBER,
	"DT_CALCULO" DATE,
	"VL_FINAL_CALCULO" NUMBER,
	"QT_PROVEDOR" NUMBER,
	"FL_PROCESSAR" VARCHAR2(1) DEFAULT 'S',
	"VL_SALDO_PENDENTE" NUMBER,
	"VL_SALDO_COMPARATIVO" NUMBER DEFAULT 0,
	"FL_POUPADOR_FIT" VARCHAR2(1) DEFAULT 'N',
	"VL_MINIMO_EMISSOR" NUMBER,
	"VL_PORCEN_FSL" NUMBER DEFAULT 0,
	"DS_SIGLA_PRO" VARCHAR2(5),
	"FL_MINIMO_RETIRADO" CHAR(1) DEFAULT 'N',
	"ID_FUNSAL_FSL" NUMBER,
	"VL_QUOTA_DIARIA" NUMBER,
	"QTD_DIAS_DESCONTADOS_UTILIZACAO" NUMBER,
	"QTD_DIAS_MARGEM_SEGURACA" NUMBER,
	"ID_SALPRO_SPJ" NUMBER,
	"FL_ISENCAO_IDOSO" CHAR(1) DEFAULT 'N',
	"VL_BALANCEADOR" NUMBER DEFAULT 0,
	"VL_FUNDO_RESERVA" NUMBER DEFAULT 0,
	"FL_PEDIDO_MINIMO" CHAR(1) DEFAULT 'N',
	"VL_PEDIDO_MINIMO_EMISSOR" NUMBER,
	"VL_CALCULO_ANTES_PEDIDO_MINIMO" NUMBER,
	"VL_REPASE_ANTES_PEDIDO_MINIMO" NUMBER,
	 CONSTRAINT "PK_PEDIDO_ECONOMIA_SALDO_FUNC" PRIMARY KEY ("ID_PEDIDO_ECONOMIA_SALDO_FUNC")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 33554432 NEXT 33554432 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_32M_01"  ENABLE,
	 CONSTRAINT "FK_PEF_PEE_ID_PEDIDO_ECONOMIA" FOREIGN KEY ("ID_PEDIDO_ECONOMIA")
	  REFERENCES "SIG_USER"."PEDIDO_ECONOMIA" ("ID_PEDIDO_ECONOMIA") ENABLE,
	 CONSTRAINT "FK_PEF_FUN_ID_FUNCIO_FUN" FOREIGN KEY ("ID_FUNCIO_FUN")
	  REFERENCES "SIG_USER"."FUNCIONARIO" ("ID_FUNCIO_FUN") ENABLE,
	 CONSTRAINT "FK_PED_ECO_ID_SALDO_PROJ" FOREIGN KEY ("ID_SALPRO_SPJ")
	  REFERENCES "SIG_USER"."PEDIDO_ECONOMIA_SALDO_PROJ" ("ID_SALPRO_SPJ") ENABLE,
	 CONSTRAINT "FK_PESF_FSL" FOREIGN KEY ("ID_FUNSAL_FSL")
	  REFERENCES "SIG_USER"."FUNCIONARIO_SALDO" ("ID_FUNSAL_FSL") DISABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_128M_01" ;

CREATE INDEX "SIG_USER"."IK_PEDECO_FUNCIO_EMISSOR" ON "SIG_USER"."PEDIDO_ECONOMIA_SALDO_FUNC" ("ID_FUNCIO_FUN", "ID_EMISSO_EMI", "VL_MINIMO_EMISSOR")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 67108864 NEXT 67108864 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_64M_01" ;
  CREATE INDEX "SIG_USER"."IK_PEDECO_FUNCIO_FUN" ON "SIG_USER"."PEDIDO_ECONOMIA_SALDO_FUNC" ("ID_FUNCIO_FUN")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 33554432 NEXT 33554432 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_32M_01" ;
  CREATE INDEX "SIG_USER"."IK_PEDECO_PEDIDO_ECONOMIA" ON "SIG_USER"."PEDIDO_ECONOMIA_SALDO_FUNC" ("ID_PEDIDO_ECONOMIA")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 33554432 NEXT 33554432 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_32M_01" ;
  CREATE INDEX "SIG_USER"."IK_PEDIDO_ECONOMIA_SALDO_FUNC_FUNCIONARIO_SALDO" ON "SIG_USER"."PEDIDO_ECONOMIA_SALDO_FUNC" ("ID_FUNSAL_FSL")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."PK_PEDIDO_ECONOMIA_SALDO_FUNC" ON "SIG_USER"."PEDIDO_ECONOMIA_SALDO_FUNC" ("ID_PEDIDO_ECONOMIA_SALDO_FUNC")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 33554432 NEXT 33554432 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_32M_01" ;

COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_SALDO_COMPARATIVO IS 'Valor utilizado para fazer comparação de saldo com implementações diferentes do poupador';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_MINIMO_EMISSOR IS 'Valor mínimo de compra no emissor. Se estiver preenchido significa que zeramos a compra.';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_PORCEN_FSL IS 'Valor do melhor saldo calculado em porcentagem tabela FUNCIONARIO_SALDO';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.DS_SIGLA_PRO IS 'Siglas do produto';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.FL_MINIMO_RETIRADO IS 'Indica se o valor mínimo de compra no emissor foi poupado/retirado do funcionario';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.ID_FUNSAL_FSL IS 'Id saldo utilizado';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_QUOTA_DIARIA IS 'Valor quota diaria';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.QTD_DIAS_DESCONTADOS_UTILIZACAO IS 'Quantidade de dias adicionada a qtd_dias_utilizacao';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.QTD_DIAS_MARGEM_SEGURACA IS 'Quantidade dias de margem de segurança';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.ID_SALPRO_SPJ IS 'Id saldo projetado utilizado';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.FL_ISENCAO_IDOSO IS 'Indica que a economia foi por motivo de isenÃ§Ã£o para idoso.';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_BALANCEADOR IS 'Valor utilizado para para determinar a porcentagem do balanceador para o poupador';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_FUNDO_RESERVA IS 'Valor utilizado para para determinar a porcentagem do fundo de reserva para o poupador';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.FL_PEDIDO_MINIMO IS 'Indica se foi aplicado o pedido mínimo (S/N).';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_PEDIDO_MINIMO_EMISSOR IS 'Valor mínimo de pedido exigido pelo emissor. Origem: regra_emissor.id_regemi_rem = 557.';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_CALCULO_ANTES_PEDIDO_MINIMO IS 'Valor calculado antes de comparar com o valor de pedido mínimo exigido pelo emissor.';
COMMENT ON COLUMN SIG_USER.PEDIDO_ECONOMIA_SALDO_FUNC.VL_REPASE_ANTES_PEDIDO_MINIMO IS 'Valor do repase antes de comparar com o valor de pedido mínimo exigido pelo emissor.';
```
- pedido
```sql
CREATE TABLE "SIG_USER"."PEDIDO"
   (	"ID_PEDIDO_PED" NUMBER NOT NULL ENABLE,
	"ID_SERVIC_SER" NUMBER NOT NULL ENABLE,
	"ID_DISTRI_DIS" NUMBER NOT NULL ENABLE,
	"ID_USUARI_USU" NUMBER NOT NULL ENABLE,
	"ID_CONTAT_CNT" NUMBER,
	"ID_CLIENT_CLI" NUMBER NOT NULL ENABLE,
	"DT_PEDIDO_PED" DATE NOT NULL ENABLE,
	"VL_TOTINS_PED" NUMBER NOT NULL ENABLE,
	"VL_TOTTAX_PED" NUMBER NOT NULL ENABLE,
	"VL_TOTAPG_PED" NUMBER NOT NULL ENABLE,
	"VL_DESCON_PED" NUMBER NOT NULL ENABLE,
	"DS_ACOMPA_PED" CLOB,
	"DS_OBSVNF_PED" VARCHAR2(60),
	"DS_PARAME_PED" VARCHAR2(200),
	"NM_RAZAOS_PED" VARCHAR2(200),
	"FL_EMPRES_PED" CHAR(1) DEFAULT 'N',
	"OB_VTONLI_PED" "SIG_USER"."T_PEDIDO_VT" ,
	"ID_FNEGPE_FNP" NUMBER,
	"ID_ORIPED_OPE" NUMBER,
	"ID_USUWEB_USW" NUMBER,
	"VL_ISSRET_PED" NUMBER,
	"OB_VTOLIN_PED" "SIG_USER"."T_PEDIDO_VT" ,
	"OB_BRASIL_PED" "SIG_USER"."T_PEDIDO_VT" ,
	"OB_NEGO04_PED" "SIG_USER"."T_PEDIDO_VT" ,
	"OB_NEGO05_PED" "SIG_USER"."T_PEDIDO_VT" ,
	"OB_NEGO06_PED" "SIG_USER"."T_PEDIDO_VT" ,
	"OB_NEGO07_PED" "SIG_USER"."T_PEDIDO_VT" ,
	"OB_NEGO08_PED" "SIG_USER"."T_PEDIDO_VT" ,
	"ID_PEDTIP_PTO" NUMBER DEFAULT 1,
	"FL_AGENDA_PED" CHAR(1) DEFAULT 'N',
	"ID_CLILIM_CLL" NUMBER,
	"DT_DISCRE_PED" DATE,
	"VL_DESINS_PED" NUMBER DEFAULT 0,
	"DT_CORCRE_PED" DATE,
	"DT_CORFIS_PED" DATE,
	"FL_RESLIM_PED" VARCHAR2(1),
	"DT_PAGPOS_PED" DATE,
	"ID_PARCER_PCE" NUMBER,
	"ID_BUNDLE_BUN" NUMBER,
	"FL_SCD_PED" VARCHAR2(1) DEFAULT 'N',
	"FL_COMPLE_PED" VARCHAR2(1) DEFAULT 'N',
	"FL_FUNRER_PED" VARCHAR2(1) DEFAULT 'N',
	"ID_SICPRO_SCP" NUMBER,
	"DS_IP" VARCHAR2(100),
	"ID_SITEVB_USUARIO" NUMBER,
	 CONSTRAINT "XPKPEDIDO" PRIMARY KEY ("ID_PEDIDO_PED")
  USING INDEX PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 8388608 NEXT 8388608 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_8M_01"  ENABLE,
	 CONSTRAINT "CK_PED_FL_EMPRES_PED" CHECK ( fl_empres_ped IN ('S','N') ) ENABLE,
	 CONSTRAINT "FK_PED_ID_PEDTIP_PTO" FOREIGN KEY ("ID_PEDTIP_PTO")
	  REFERENCES "SIG_USER"."PEDIDO_TIPO" ("ID_PEDTIP_PTO") ENABLE,
	 CONSTRAINT "FK_PED_ID_CLILIM_CLL" FOREIGN KEY ("ID_CLILIM_CLL")
	  REFERENCES "SIG_USER"."CLIENTE_LIMITE" ("ID_CLILIM_CLL") ENABLE,
	 CONSTRAINT "FK_PED_USW_ID_USUWEB_USW" FOREIGN KEY ("ID_USUWEB_USW")
	  REFERENCES "SIG_USER"."USUARIO_WEB" ("ID_USUWEB_USW") ENABLE,
	 CONSTRAINT "FK_PED_FNP_ID_FNEGPE_FNP" FOREIGN KEY ("ID_FNEGPE_FNP")
	  REFERENCES "SIG_USER"."FASE_NEGOCIO_PEDIDO" ("ID_FNEGPE_FNP") ENABLE,
	 CONSTRAINT "FK_PED_OPE_ID_ORIPED_OPE" FOREIGN KEY ("ID_ORIPED_OPE")
	  REFERENCES "SIG_USER"."ORIGEM_PEDIDO" ("ID_ORIPED_OPE") ENABLE,
	 CONSTRAINT "FK_PED_CLI_ID_CLIENT_CLI" FOREIGN KEY ("ID_CLIENT_CLI")
	  REFERENCES "SIG_USER"."CLIENTE" ("ID_CLIENT_CLI") ON DELETE CASCADE ENABLE,
	 CONSTRAINT "FK_PED_CNT_ID_CONTAT_CNT" FOREIGN KEY ("ID_CONTAT_CNT")
	  REFERENCES "SIG_USER"."CONTATO" ("ID_CONTAT_CNT") ENABLE,
	 CONSTRAINT "FK_PED_SER_ID_SERVIC_SER" FOREIGN KEY ("ID_SERVIC_SER")
	  REFERENCES "SIG_USER"."SERVICO" ("ID_SERVIC_SER") ON DELETE CASCADE ENABLE,
	 CONSTRAINT "FK_PED_USU_ID_USUARI_USU" FOREIGN KEY ("ID_USUARI_USU")
	  REFERENCES "SIG_USER"."USUARIO" ("ID_USUARI_USU") ENABLE,
	 CONSTRAINT "FK_PED_DIS_ID_DISTRI_DIS" FOREIGN KEY ("ID_DISTRI_DIS")
	  REFERENCES "SIG_USER"."DISTRIBUIDOR" ("ID_DISTRI_DIS") ENABLE,
	 CONSTRAINT "FK_PED_ID_PARCER_PCE" FOREIGN KEY ("ID_PARCER_PCE")
	  REFERENCES "SIG_USER"."PARCERIA" ("ID_PARCER_PCE") ENABLE,
	 CONSTRAINT "FK_ID_BUNDLE_PED" FOREIGN KEY ("ID_BUNDLE_BUN")
	  REFERENCES "SIG_USER"."BUNDLE" ("ID_BUNDLE_BUN") ENABLE,
	 CONSTRAINT "FK_PED_ID_SICPRO_SCP" FOREIGN KEY ("ID_SICPRO_SCP")
	  REFERENCES "SIG_USER"."SIMULE_COMPRE_PRODUTO" ("ID_SICPRO_SCP") ENABLE,
	 CONSTRAINT "FK_SITEVB_USUARIO" FOREIGN KEY ("ID_SITEVB_USUARIO")
	  REFERENCES "SIG_USER"."SITEVB_USUARIO" ("ID_SITEVB_USUARIO") ENABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 70 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_128M_01"
 LOB ("DS_ACOMPA_PED") STORE AS SECUREFILE "DS_ACOMPA_PED"(
  TABLESPACE "TS_LOB_SIGUSER_512K_01" ENABLE STORAGE IN ROW CHUNK 8192
  NOCACHE LOGGING  NOCOMPRESS  KEEP_DUPLICATES
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;

CREATE INDEX "SIG_USER"."IDX$$_023F0004" ON "SIG_USER"."PEDIDO" ("ID_ORIPED_OPE", "ID_PEDIDO_PED", "OB_VTONLI_PED"."DT_PAGREA_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 8388608 NEXT 8388608 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_8M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_023F0026" ON "SIG_USER"."PEDIDO" (TO_CHAR("OB_VTONLI_PED"."DT_PAGREA_PED",'MM/YYYY'), "OB_VTONLI_PED"."DT_PAGREA_PED", "ID_PEDIDO_PED", "ID_CLIENT_CLI")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 16777216 NEXT 16777216 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_16M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_121F0001" ON "SIG_USER"."PEDIDO" ("ID_PEDIDO_PED"+0, "ID_CLIENT_CLI")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 2
  STORAGE(INITIAL 8388608 NEXT 8388608 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_8M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_130D0001" ON "SIG_USER"."PEDIDO" (NVL("ID_PEDTIP_PTO",1), "ID_PEDIDO_PED", "ID_FNEGPE_FNP")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 3
  STORAGE(INITIAL 8388608 NEXT 8388608 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_8M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_134D0001" ON "SIG_USER"."PEDIDO" ("ID_DISTRI_DIS")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 4194304 NEXT 4194304 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_4M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_13E70001" ON "SIG_USER"."PEDIDO" ("ID_CLIENT_CLI", "OB_VTONLI_PED"."DT_PAGREA_PED", "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 3
  STORAGE(INITIAL 16777216 NEXT 16777216 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_16M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_13E70004" ON "SIG_USER"."PEDIDO" ("ID_CLIENT_CLI", "ID_DISTRI_DIS", "OB_VTONLI_PED"."DT_PAGREA_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 3
  STORAGE(INITIAL 8388608 NEXT 8388608 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_8M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_3FB10001" ON "SIG_USER"."PEDIDO" ("ID_PEDTIP_PTO")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 4194304 NEXT 4194304 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_4M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_411380001" ON "SIG_USER"."PEDIDO" ("DT_PEDIDO_PED", "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 16777216 NEXT 16777216 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_16M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_B2AF0001" ON "SIG_USER"."PEDIDO" ("OB_VTONLI_PED"."DT_PAGREA_PED", "ID_PEDIDO_PED", "ID_CLIENT_CLI")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 16777216 NEXT 16777216 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_16M_01" ;
  CREATE INDEX "SIG_USER"."IDX_ID_PED_ID_FNE" ON "SIG_USER"."PEDIDO" ("ID_PEDIDO_PED", "ID_FNEGPE_FNP")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 16777216 NEXT 16777216 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_16M_01" ;
  CREATE INDEX "SIG_USER"."IDX_PEDIDO_PARCERIA" ON "SIG_USER"."PEDIDO" ("ID_PARCER_PCE")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IDX_TEST3" ON "SIG_USER"."PEDIDO" ("ID_CLIENT_CLI", "ID_PEDTIP_PTO", "ID_SERVIC_SER", "ID_FNEGPE_FNP", "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 16777216 NEXT 16777216 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_16M_01" ;
  CREATE INDEX "SIG_USER"."IK_PED_BRASIL_DT_PAGREA_PED" ON "SIG_USER"."PEDIDO" ("OB_BRASIL_PED"."DT_PAGREA_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IK_PED_CLI_FNEGPE" ON "SIG_USER"."PEDIDO" ("ID_CLIENT_CLI", "ID_FNEGPE_FNP", "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 16777216 NEXT 16777216 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_16M_01" ;
  CREATE INDEX "SIG_USER"."IK_PED_DT_DISCRE_PED" ON "SIG_USER"."PEDIDO" ("DT_DISCRE_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IK_PED_ID_FNEGPE_FNP" ON "SIG_USER"."PEDIDO" ("ID_FNEGPE_FNP")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 4194304 NEXT 4194304 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_4M_01" ;
  CREATE INDEX "SIG_USER"."IK_PED_ID_SERVIC_SER" ON "SIG_USER"."PEDIDO" ("ID_SERVIC_SER")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 4194304 NEXT 4194304 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_4M_01" ;
  CREATE INDEX "SIG_USER"."IK_PED_VTONLI_DT_PAGREA_PED" ON "SIG_USER"."PEDIDO" ("OB_VTONLI_PED"."DT_PAGREA_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 4194304 NEXT 4194304 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_4M_01" ;
  CREATE INDEX "SIG_USER"."IK_PED_VTONLI_DT_PAGREA_PED2" ON "SIG_USER"."PEDIDO" (NVL("ID_PARCER_PCE",0), "OB_VTONLI_PED"."DT_PAGREA_PED", "ID_FNEGPE_FNP")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 4194304 NEXT 4194304 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_4M_01" ;
  CREATE INDEX "SIG_USER"."IX_PED_VTONLI_DT_PAGPRO_PED" ON "SIG_USER"."PEDIDO" ("OB_VTONLI_PED"."DT_PAGPRO_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 8388608 NEXT 8388608 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_8M_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."SYS_IL0000152120C00012$$" ON "SIG_USER"."PEDIDO" (
  PCTFREE 10 INITRANS 2 MAXTRANS 255
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_LOB_SIGUSER_512K_01"
  PARALLEL (DEGREE 0 INSTANCES 0) ;
  CREATE INDEX "SIG_USER"."XIE1PEDIDO" ON "SIG_USER"."PEDIDO" ("ID_CLIENT_CLI")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 4194304 NEXT 4194304 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_4M_01" ;
  CREATE INDEX "SIG_USER"."XIE5PEDIDO" ON "SIG_USER"."PEDIDO" ("DT_PEDIDO_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 8388608 NEXT 8388608 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_8M_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."XPKPEDIDO" ON "SIG_USER"."PEDIDO" ("ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 8388608 NEXT 8388608 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_8M_01" ;

COMMENT ON COLUMN SIG_USER.PEDIDO.DT_DISCRE_PED IS 'data de disponibilização do crédito';
COMMENT ON COLUMN SIG_USER.PEDIDO.VL_DESINS_PED IS 'desconto no item';
COMMENT ON COLUMN SIG_USER.PEDIDO.DT_CORCRE_PED IS 'data de corte crédito';
COMMENT ON COLUMN SIG_USER.PEDIDO.DT_CORFIS_PED IS 'data de corte físico';
COMMENT ON COLUMN SIG_USER.PEDIDO.FL_RESLIM_PED IS 'flag indica se já restabeleceu o limite de cr¿dito pós-pago S/N';
COMMENT ON COLUMN SIG_USER.PEDIDO.DT_PAGPOS_PED IS 'data de pagamento real de pedido pós-pago';
COMMENT ON COLUMN SIG_USER.PEDIDO.ID_BUNDLE_BUN IS 'id bunle';
COMMENT ON COLUMN SIG_USER.PEDIDO.FL_SCD_PED IS 'indica se o pedido SCD.    S/N';
COMMENT ON COLUMN SIG_USER.PEDIDO.FL_COMPLE_PED IS 'FLAG QUE DETERMINA O PERIODO DE UTILIZACAO - PEDIDO COMPLEMENTAR. S/N';
COMMENT ON COLUMN SIG_USER.PEDIDO.FL_FUNRER_PED IS 'FLAG QUE DETERMINA  PEDIDO FUNDO DE RESERVA. S/N';
COMMENT ON COLUMN SIG_USER.PEDIDO.ID_SICPRO_SCP IS 'id simule e compre produto';
COMMENT ON COLUMN SIG_USER.PEDIDO.DS_IP IS 'IP de origem do pedido';
COMMENT ON COLUMN SIG_USER.PEDIDO.ID_SITEVB_USUARIO IS 'ID do usuario que realizou o pedido no site spe';
```
- pedido_local
```sql
CREATE TABLE "SIG_USER"."PEDIDO_LOCAL"
   (	"ID_PEDIDO_PED" NUMBER,
	"ID_ENCOME_ENC" NUMBER,
	"ID_INSUMO_INS" NUMBER,
	"VL_UNITAR_PLO" NUMBER,
	"QT_NOBLOC_PLO" NUMBER,
	"QT_INSUMO_PLO" NUMBER,
	"FL_COMBIN_PLO" CHAR(1),
	 CONSTRAINT "ZE_PLO_QT_INSUMO_PLO" CHECK (QT_INSUMO_PLO > 0) ENABLE,
	 CONSTRAINT "PK_PEDIDO_LOCAL" PRIMARY KEY ("ID_PEDIDO_PED", "ID_ENCOME_ENC", "ID_INSUMO_INS", "VL_UNITAR_PLO", "QT_NOBLOC_PLO")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01"  ENABLE,
	 CONSTRAINT "NN_PLO_ID_PEDIDO_PED" CHECK ( id_pedido_ped IS NOT NULL ) ENABLE,
	 CONSTRAINT "NN_PLO_ID_ENCOME_ENC" CHECK ( id_encome_enc IS NOT NULL ) ENABLE,
	 CONSTRAINT "NN_PLO_ID_INSUMO_INS" CHECK ( id_insumo_ins IS NOT NULL ) ENABLE,
	 CONSTRAINT "NN_PLO_VL_UNITAR_PLO" CHECK ( vl_unitar_plo IS NOT NULL ) ENABLE,
	 CONSTRAINT "NN_PLO_QT_NOBLOC_PLO" CHECK ( qt_nobloc_plo IS NOT NULL ) ENABLE,
	 SUPPLEMENTAL LOG DATA (ALL) COLUMNS,
	 SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS,
	 CONSTRAINT "FK_PLO_PED_ID_ENCOME_ENC" FOREIGN KEY ("ID_ENCOME_ENC")
	  REFERENCES "SIG_USER"."ENCOMENDA" ("ID_ENCOME_ENC") ON DELETE CASCADE ENABLE,
	 CONSTRAINT "FK_PLO_PED_ID_PEDIDO_PED" FOREIGN KEY ("ID_PEDIDO_PED")
	  REFERENCES "SIG_USER"."PEDIDO" ("ID_PEDIDO_PED") ON DELETE CASCADE ENABLE,
	 CONSTRAINT "FK_PLO_INS_ID_INSUMO_INS" FOREIGN KEY ("ID_INSUMO_INS")
	  REFERENCES "SIG_USER"."INSUMO" ("ID_INSUMO_INS") ENABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_128M_01" ;

CREATE INDEX "SIG_USER"."IDX$$_00670001" ON "SIG_USER"."PEDIDO_LOCAL" ("ID_INSUMO_INS", "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_11FB0001" ON "SIG_USER"."PEDIDO_LOCAL" ("ID_INSUMO_INS"+0, "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 2
  STORAGE(INITIAL 67108864 NEXT 67108864 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_64M_01" ;
  CREATE INDEX "SIG_USER"."IDX_ID_PEDIDO_PED" ON "SIG_USER"."PEDIDO_LOCAL" ("ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 67108864 NEXT 67108864 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_64M_01" ;
  CREATE INDEX "SIG_USER"."IDX_ID_PEDIDO_PED_DBA" ON "SIG_USER"."PEDIDO_LOCAL" ("ID_PEDIDO_PED", "ID_INSUMO_INS")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;
  CREATE INDEX "SIG_USER"."IDX_VL_UNITAR_PLO" ON "SIG_USER"."PEDIDO_LOCAL" ("VL_UNITAR_PLO")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 67108864 NEXT 67108864 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_64M_01" ;
  CREATE INDEX "SIG_USER"."IK_PLO_ID_ENCOME_ENC" ON "SIG_USER"."PEDIDO_LOCAL" ("ID_ENCOME_ENC")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 67108864 NEXT 67108864 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_64M_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."PK_PEDIDO_LOCAL" ON "SIG_USER"."PEDIDO_LOCAL" ("ID_PEDIDO_PED", "ID_ENCOME_ENC", "ID_INSUMO_INS", "VL_UNITAR_PLO", "QT_NOBLOC_PLO")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;

```
- taxa_pedido
```sql
CREATE TABLE "SIG_USER"."TAXA_PEDIDO"
   (	"ID_PEDIDO_PED" NUMBER NOT NULL ENABLE,
	"ID_SERVIC_SER" NUMBER NOT NULL ENABLE,
	"ID_PRODUT_PRO" NUMBER,
	"ID_TAXTIP_TTP" NUMBER NOT NULL ENABLE,
	"DS_TAXPED_TXP" VARCHAR2(200) NOT NULL ENABLE,
	"VL_TAXPED_TXP" NUMBER NOT NULL ENABLE,
	"FL_TIPTAX_TXP" CHAR(1) NOT NULL ENABLE,
	"ID_SUBPRO_SPR" NUMBER,
	"NR_CONDIC_TXP" NUMBER DEFAULT 0 NOT NULL ENABLE,
	"ID_BUNDLE_BUN" NUMBER,
	"ID_CONDIC_CON" NUMBER,
	"VL_BASCAL_TXP" NUMBER,
	"NR_RATEIO_TXP" NUMBER,
	"VL_TAXPED_APOS_PEDIDO_MINIMO" NUMBER,
	 SUPPLEMENTAL LOG DATA (ALL) COLUMNS,
	 SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS,
	 CONSTRAINT "FK_TXP_PRO_ID_PRODUT_PRO" FOREIGN KEY ("ID_PRODUT_PRO")
	  REFERENCES "SIG_USER"."PRODUTO" ("ID_PRODUT_PRO") ENABLE,
	 CONSTRAINT "FK_TXP_SER_ID_SERVIC_SER" FOREIGN KEY ("ID_SERVIC_SER")
	  REFERENCES "SIG_USER"."SERVICO" ("ID_SERVIC_SER") ENABLE,
	 CONSTRAINT "FK_TXP_TTP_ID_TAXTIP_TTP" FOREIGN KEY ("ID_TAXTIP_TTP")
	  REFERENCES "SIG_USER"."TAXA_TIPO" ("ID_TAXTIP_TTP") ENABLE,
	 CONSTRAINT "FK_ID_BUNDLE_TXP" FOREIGN KEY ("ID_BUNDLE_BUN")
	  REFERENCES "SIG_USER"."BUNDLE" ("ID_BUNDLE_BUN") ENABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 15 PCTUSED 70 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_128M_01" ;

CREATE INDEX "SIG_USER"."IDX$$_01050001" ON "SIG_USER"."TAXA_PEDIDO" ("ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 33554432 NEXT 33554432 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_32M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_13E70005" ON "SIG_USER"."TAXA_PEDIDO" ("ID_SERVIC_SER", "ID_TAXTIP_TTP", NVL("ID_PRODUT_PRO",0), "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 67108864 NEXT 67108864 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_64M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_13E70006" ON "SIG_USER"."TAXA_PEDIDO" ("ID_SERVIC_SER", "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 33554432 NEXT 33554432 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_32M_01" ;
  CREATE INDEX "SIG_USER"."IX_TXP_TAXA_PEDIDO" ON "SIG_USER"."TAXA_PEDIDO" ("ID_TAXTIP_TTP", "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 33554432 NEXT 33554432 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_32M_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."UK_TAXA_PEDIDO" ON "SIG_USER"."TAXA_PEDIDO" ("ID_PEDIDO_PED", "ID_TAXTIP_TTP", "ID_SERVIC_SER", "ID_PRODUT_PRO", "ID_SUBPRO_SPR")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 67108864 NEXT 67108864 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_64M_01" ;

COMMENT ON COLUMN SIG_USER.TAXA_PEDIDO.ID_BUNDLE_BUN IS 'FK sig_user.bundle.id_bundle_bun';
COMMENT ON COLUMN SIG_USER.TAXA_PEDIDO.ID_CONDIC_CON IS 'historico da PK condicao_comercial.id_condic_con utilizada para gravacao da taxa';
COMMENT ON COLUMN SIG_USER.TAXA_PEDIDO.VL_BASCAL_TXP IS 'base de calculo da taxa (Volume do produto/subproduto da taxa; qtdes de funcionarios, encomendas, emissores, etc)';
COMMENT ON COLUMN SIG_USER.TAXA_PEDIDO.NR_RATEIO_TXP IS 'NO CASO DE TAXAS COBRADAS UNICA VEZ NO PEDIDO, O VALOR DA CONDICAO COMERCIAL DEVE SER RATEADO ENTRE PRODUTOS E SUBPRODUTOS; REPRESENTA A FRACAO DO RATEIO';
COMMENT ON COLUMN SIG_USER.TAXA_PEDIDO.VL_TAXPED_APOS_PEDIDO_MINIMO IS 'Taxa recalculada após aplicação do pedido mínimo. Usada apenas como log/auditoria (taxa descartada quando a regra 59 mantém a taxa inicial).';
```
- interface_master
```sql
CREATE TABLE "SIG_USER"."INTERFACE_MASTER"
   (	"ID_FUNCIO_INT" NUMBER NOT NULL ENABLE,
	"ID_PEDIDO_PED" NUMBER NOT NULL ENABLE,
	"NM_FUNCIO_INT" VARCHAR2(100) NOT NULL ENABLE,
	"NM_CARGOF_INT" VARCHAR2(30),
	"NM_SETORF_INT" VARCHAR2(40),
	"CD_REGIST_INT" VARCHAR2(15),
	"ID_FUNCIO_FUN" NUMBER,
	"CD_REGGER_INT" VARCHAR2(15),
	"CD_NUMCPF_INT" VARCHAR2(11),
	"DT_NASCIM_INT" DATE,
	"QT_NRDIAS_INT" NUMBER,
	"NM_MAEFUN_INT" VARCHAR2(100),
	 CONSTRAINT "XPKINTERFACE_MASTER" PRIMARY KEY ("ID_FUNCIO_INT")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01"  ENABLE,
	 CONSTRAINT "NN_INT_QT_NRDIAS_INT" CHECK ( qt_nrdias_int IS NOT NULL ) ENABLE,
	 SUPPLEMENTAL LOG DATA (ALL) COLUMNS,
	 SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS,
	 CONSTRAINT "FK_INT_PED_ID_PEDIDO_PED" FOREIGN KEY ("ID_PEDIDO_PED")
	  REFERENCES "SIG_USER"."PEDIDO" ("ID_PEDIDO_PED") ENABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 60 INITRANS 1 MAXTRANS 255
 ROW STORE COMPRESS ADVANCED LOGGING
  STORAGE(INITIAL 1073741824 NEXT 1073741824 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_1G_01"  ENABLE ROW MOVEMENT ;

CREATE INDEX "SIG_USER"."IDX$$_14E30002" ON "SIG_USER"."INTERFACE_MASTER" ("ID_FUNCIO_FUN")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_411380002" ON "SIG_USER"."INTERFACE_MASTER" ("ID_FUNCIO_FUN", "ID_FUNCIO_INT", "ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 268435456 NEXT 268435456 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;
  CREATE INDEX "SIG_USER"."IK_ITM_CD_NUMCPF_INT" ON "SIG_USER"."INTERFACE_MASTER" ("CD_NUMCPF_INT")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."IK_ITM_FUNCIO_FUN_FUNCIO_INT" ON "SIG_USER"."INTERFACE_MASTER" ("ID_FUNCIO_FUN", "ID_FUNCIO_INT")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;
  CREATE INDEX "SIG_USER"."IX_ITM_PED_FUN_INT_CPF_DIAS" ON "SIG_USER"."INTERFACE_MASTER" ("ID_PEDIDO_PED", "ID_FUNCIO_FUN", "ID_FUNCIO_INT", "CD_NUMCPF_INT", "QT_NRDIAS_INT")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 5
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512M_01" ;
  CREATE INDEX "SIG_USER"."XIE1INTERFACE_MASTER" ON "SIG_USER"."INTERFACE_MASTER" ("ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."XPKINTERFACE_MASTER" ON "SIG_USER"."INTERFACE_MASTER" ("ID_FUNCIO_INT")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_128M_01" ;

```
- interface_detalhe
```sql
CREATE TABLE "SIG_USER"."INTERFACE_DETALHE"
(	"ID_FUNCIO_INT" NUMBER NOT NULL ENABLE,
     "ID_INSUMO_INS" NUMBER NOT NULL ENABLE,
     "VL_UNITAR_IND" NUMBER NOT NULL ENABLE,
     "QT_NOBLOC_IND" NUMBER NOT NULL ENABLE,
     "QT_INSUMO_IND" NUMBER NOT NULL ENABLE,
     "ID_PEDIDO_PED" NUMBER NOT NULL ENABLE,
     "CD_NUMERO_IND" VARCHAR2(35),
     "ID_CARTAO_CAR" NUMBER,
     "ID_INTDET_IND" NUMBER(*,0) DEFAULT "SIG_USER"."SQ_INTERFACE_DETALHE"."NEXTVAL",
     CONSTRAINT "XPKINTERFACE_DETALHE" PRIMARY KEY ("ID_FUNCIO_INT", "ID_INSUMO_INS", "VL_UNITAR_IND", "QT_NOBLOC_IND")
         USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
         STORAGE(INITIAL 536870912 NEXT 536870912 MINEXTENTS 1 MAXEXTENTS 2147483645
         PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
         BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
         TABLESPACE "TS_IND_SIGUSER_512M_01"  ENABLE,
     CONSTRAINT "VALOR_MAIOR_ZERO115" CHECK (vl_unitar_ind > 0) ENABLE NOVALIDATE,
     CONSTRAINT "VALOR_MAIOR_ZERO116" CHECK (qt_nobloc_ind > 0) ENABLE NOVALIDATE,
     CONSTRAINT "VALOR_MAIOR_ZERO117" CHECK (qt_insumo_ind > 0) ENABLE NOVALIDATE,
     SUPPLEMENTAL LOG DATA (ALL) COLUMNS,
     SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS,
     CONSTRAINT "FK_IND_CAR_ID_CARTAO_CAR" FOREIGN KEY ("ID_CARTAO_CAR")
         REFERENCES "SIG_USER"."CARTAO" ("ID_CARTAO_CAR") ENABLE,
     CONSTRAINT "FK_IND_INT_ID_FUNCIO_INT" FOREIGN KEY ("ID_FUNCIO_INT")
         REFERENCES "SIG_USER"."INTERFACE_MASTER" ("ID_FUNCIO_INT") ON DELETE CASCADE ENABLE,
     CONSTRAINT "FK_IND_INS_ID_INSUMO_INS" FOREIGN KEY ("ID_INSUMO_INS")
         REFERENCES "SIG_USER"."INSUMO" ("ID_INSUMO_INS") ENABLE
) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 70 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 1073741824 NEXT 1073741824 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_1G_01"  ENABLE ROW MOVEMENT ;

CREATE INDEX "SIG_USER"."IDX$$_10430004" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_PEDIDO_PED", "VL_UNITAR_IND")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 536870912 NEXT 536870912 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512M_01" ;
CREATE INDEX "SIG_USER"."IDX$$_10430005" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_FUNCIO_INT", "ID_PEDIDO_PED")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 536870912 NEXT 536870912 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512M_01" ;
CREATE INDEX "SIG_USER"."IDX$$_13E70008" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_PEDIDO_PED", "ID_INSUMO_INS")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 2
  STORAGE(INITIAL 268435456 NEXT 268435456 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_256M_01" ;
CREATE INDEX "SIG_USER"."IDX$$_14070002" ON "SIG_USER"."INTERFACE_DETALHE" ("CD_NUMERO_IND")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 268435456 NEXT 268435456 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_256M_01" ;
CREATE INDEX "SIG_USER"."IDX$$_411380003" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_INSUMO_INS", "ID_FUNCIO_INT", "ID_PEDIDO_PED")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 536870912 NEXT 536870912 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512M_01" ;
CREATE INDEX "SIG_USER"."IDX$$_51620001" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_INSUMO_INS")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 536870912 NEXT 536870912 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512M_01" ;
CREATE INDEX "SIG_USER"."ID_ID_INTDET_IND_IND" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_INTDET_IND")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 536870912 NEXT 536870912 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512M_01" ;
CREATE INDEX "SIG_USER"."IK_IND_ID_CARTAO_CAR" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_CARTAO_CAR")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 268435456 NEXT 268435456 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_256M_01" ;
CREATE INDEX "SIG_USER"."IK_IND_ID_PEDIDO_PED" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_PEDIDO_PED")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 268435456 NEXT 268435456 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_256M_01" ;
CREATE UNIQUE INDEX "SIG_USER"."XPKINTERFACE_DETALHE" ON "SIG_USER"."INTERFACE_DETALHE" ("ID_FUNCIO_INT", "ID_INSUMO_INS", "VL_UNITAR_IND", "QT_NOBLOC_IND")
    PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 536870912 NEXT 536870912 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512M_01" ;


```
- emissor_insumo
```sql
CREATE TABLE "SIG_USER"."EMISSOR_INSUMO"
   (	"ID_INSUMO_INS" NUMBER NOT NULL ENABLE,
	"FL_PRINCI_FIN" CHAR(1) DEFAULT ('S'),
	"ID_EMIEND_EEN" NUMBER,
	"ID_EMISSO_EMI" NUMBER,
	"FL_ATIVOS_FIN" CHAR(1) DEFAULT 'S',
	"QT_DIAREC_EIN" NUMBER,
	"FL_ESTOQU_EIN" CHAR(1) DEFAULT 'N',
	 CONSTRAINT "PK_EMISSOR_INSUMO" PRIMARY KEY ("ID_EMISSO_EMI", "ID_INSUMO_INS")
  USING INDEX PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01"  ENABLE,
	 SUPPLEMENTAL LOG DATA (ALL) COLUMNS,
	 SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS,
	 CONSTRAINT "FK_FIN_EMI" FOREIGN KEY ("ID_EMISSO_EMI")
	  REFERENCES "SIG_USER"."EMISSOR" ("ID_EMISSO_EMI") ENABLE,
	 CONSTRAINT "FK_FIN_INS" FOREIGN KEY ("ID_INSUMO_INS")
	  REFERENCES "SIG_USER"."INSUMO" ("ID_INSUMO_INS") ENABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 20 PCTUSED 40 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_512K_01" ;

CREATE INDEX "SIG_USER"."EMISSOR_INSUMO_IX02" ON "SIG_USER"."EMISSOR_INSUMO" ("ID_INSUMO_INS", "ID_EMISSO_EMI", "FL_ATIVOS_FIN", "FL_PRINCI_FIN")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."EMI_INS_IX01" ON "SIG_USER"."EMISSOR_INSUMO" ("ID_INSUMO_INS", "ID_EMISSO_EMI")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IK_FIN_ID_EMIEND_EEN" ON "SIG_USER"."EMISSOR_INSUMO" ("ID_EMIEND_EEN")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IK_FIN_ID_INSUMO_INS" ON "SIG_USER"."EMISSOR_INSUMO" ("ID_INSUMO_INS")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 INVISIBLE COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01"  ;
  CREATE UNIQUE INDEX "SIG_USER"."PK_EMISSOR_INSUMO" ON "SIG_USER"."EMISSOR_INSUMO" ("ID_EMISSO_EMI", "ID_INSUMO_INS")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS COMPRESS 1
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;

COMMENT ON COLUMN SIG_USER.EMISSOR_INSUMO.QT_DIAREC_EIN IS 'QUANTIDADE DE DIAS PARA QUE A RECARGA SEJA DISPONIBILIZADA APOS PAGAMENTO AO EMISSOR';
COMMENT ON COLUMN SIG_USER.EMISSOR_INSUMO.FL_ESTOQU_EIN IS 'Campo para informar se o item há necessidade de ter estoque por emissor';
```
- insumo_negocio
```sql
CREATE TABLE "SIG_USER"."INSUMO_NEGOCIO"
   (	"ID_NEGINS_NIN" NUMBER NOT NULL ENABLE,
	"ID_INSUMO_INS" NUMBER NOT NULL ENABLE,
	"CD_FORNEC_INS" VARCHAR2(20),
	"ID_NEGEMP_NEM" NUMBER NOT NULL ENABLE,
	"FL_VLFACE_INS" CHAR(1),
	"FL_MULTIP_INS" CHAR(1),
	"FL_BLOCAD_INS" CHAR(1),
	"FL_COMBIN_INS" CHAR(1),
	"FL_CADAST_INS" CHAR(1),
	"FL_LINHAS_INS" CHAR(1),
	"FL_RECLIN_INS" CHAR(1),
	"FL_COMPOS_INS" CHAR(1),
	"FL_ADVALO_INS" CHAR(1),
	"FL_MOSTRA_INS" CHAR(1),
	"FL_ESEDEX_INS" CHAR(1),
	"ID_INSTIP_ITP" NUMBER,
	"FL_REPASS_INS" CHAR(1) DEFAULT 'N' NOT NULL ENABLE,
	"FL_RODOVI_INS" CHAR(1) DEFAULT 'N',
	"FL_IESTAD_INS" CHAR(1) DEFAULT 'N',
	"FL_TEMBAR_INS" CHAR(1) DEFAULT 'N',
	"FL_SEGURO_INS" CHAR(1) DEFAULT 'N',
	"FL_VALIDA_INS" CHAR(1) DEFAULT 'N',
	"FL_EXPRES_INS" CHAR(1) DEFAULT 'N',
	"FL_BENPAT_INS" CHAR(1) DEFAULT 'I',
	"FL_NOMINAL_INS" CHAR(1) DEFAULT 'I',
	 CONSTRAINT "PK_INSUMO_NEGOCIO" PRIMARY KEY ("ID_NEGINS_NIN")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01"  ENABLE,
	 SUPPLEMENTAL LOG DATA (ALL) COLUMNS,
	 SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS,
	 CONSTRAINT "FK_NIN_ITP_ID_INSTIP_ITP" FOREIGN KEY ("ID_INSTIP_ITP")
	  REFERENCES "SIG_USER"."INSUMO_TIPO" ("ID_INSTIP_ITP") ON DELETE CASCADE ENABLE,
	 CONSTRAINT "FK_NIN_INS_ID_INSUMO_INS" FOREIGN KEY ("ID_INSUMO_INS")
	  REFERENCES "SIG_USER"."INSUMO" ("ID_INSUMO_INS") ON DELETE CASCADE ENABLE,
	 CONSTRAINT "FK_NIN_NEM_ID_NEGEMP_NEM" FOREIGN KEY ("ID_NEGEMP_NEM")
	  REFERENCES "SIG_USER"."NEGOCIO_EMPRESA" ("ID_NEGEMP_NEM") ON DELETE CASCADE ENABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_512K_01"
   CACHE ;
  CREATE INDEX "SIG_USER"."IK_NIN_ID_NEGEMP_NEM" ON "SIG_USER"."INSUMO_NEGOCIO" ("ID_NEGEMP_NEM", "ID_INSUMO_INS")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
ALTER TABLE "SIG_USER"."INSUMO_NEGOCIO" ADD CONSTRAINT "UK_INSUMO_NEGOCIO" UNIQUE ("ID_INSUMO_INS", "ID_NEGEMP_NEM")
  USING INDEX "SIG_USER"."IK_NIN_ID_NEGEMP_NEM"  ENABLE;

CREATE INDEX "SIG_USER"."IDX$$_01830002" ON "SIG_USER"."INSUMO_NEGOCIO" ("ID_INSUMO_INS", "ID_NEGEMP_NEM"+0)
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_036C0005" ON "SIG_USER"."INSUMO_NEGOCIO" ("FL_VLFACE_INS")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_04D80001" ON "SIG_USER"."INSUMO_NEGOCIO" ("ID_INSTIP_ITP", "ID_INSUMO_INS")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_15520001" ON "SIG_USER"."INSUMO_NEGOCIO" ("FL_EXPRES_INS", "ID_INSUMO_INS")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_33E60001" ON "SIG_USER"."INSUMO_NEGOCIO" ("ID_NEGEMP_NEM", "FL_REPASS_INS", "ID_INSUMO_INS")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IK_NIN_ID_NEGEMP_NEM" ON "SIG_USER"."INSUMO_NEGOCIO" ("ID_NEGEMP_NEM", "ID_INSUMO_INS")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IK_NIN_INSUMO_NEGOCIO" ON "SIG_USER"."INSUMO_NEGOCIO" ("ID_INSUMO_INS", "ID_NEGEMP_NEM")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."PK_INSUMO_NEGOCIO" ON "SIG_USER"."INSUMO_NEGOCIO" ("ID_NEGINS_NIN")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;

COMMENT ON COLUMN SIG_USER.INSUMO_NEGOCIO.FL_RODOVI_INS IS 'SE O ITEM É UM TRANSPORTE RODOVIARIO (DE UM MUNICIPIO AO OUTRO DIFERENTE EMTU)';
COMMENT ON COLUMN SIG_USER.INSUMO_NEGOCIO.FL_IESTAD_INS IS 'SE O ITEM É UM TRANSPORTE RODOVIARIO, SE DESTINO E ORIGEM SÃO ENTRE ESTADOS EXEMPLO (SAO PAULO / MINAS GERAIS)';
COMMENT ON COLUMN SIG_USER.INSUMO_NEGOCIO.FL_TEMBAR_INS IS 'SE O ITEM É UMA TAXA DE EMBARQUE (ITEM RODOVIARIO)';
COMMENT ON COLUMN SIG_USER.INSUMO_NEGOCIO.FL_SEGURO_INS IS 'SE O ITEM É UMA TAXA SEGURO (ITEM RODOVIARIO)';
COMMENT ON COLUMN SIG_USER.INSUMO_NEGOCIO.FL_VALIDA_INS IS 'S=ITEM POSSUI PRAZO DE VALIDADE E DEVE SER INFORMADO NO CADASTRO DO BENEFICIO E VALIDADO COM O PERIODO DE UTILIZACACAO NO PEDIDO';
COMMENT ON COLUMN SIG_USER.INSUMO_NEGOCIO.FL_EXPRES_INS IS 'SE O ITEM É UM TIPO RH (CREDITO/CARTAO) - SEM FUNCIONARIO VINCULADO';
COMMENT ON COLUMN SIG_USER.INSUMO_NEGOCIO.FL_BENPAT_INS IS 'I - INDIFERENTE  N - É UM AUXILIO  NÃO E PAT     S - SIM  É PAT';
COMMENT ON COLUMN SIG_USER.INSUMO_NEGOCIO.FL_NOMINAL_INS IS 'S-SIM INSUMO NOMINAL OBRIGATORIO ACEITE ''MULTI_NOMINAL''; N-NAO INSUMO NAO NOMINAL; I-INDIFERENTE';
```
- insumo_tipo
```sql
CREATE TABLE "SIG_USER"."INSUMO_TIPO"
   (	"ID_INSTIP_ITP" NUMBER,
	"DS_INSTIP_ITP" VARCHAR2(40),
	"FL_INSTIP_ITP" CHAR(1) NOT NULL ENABLE,
	"FL_CELULA_ITP" CHAR(1) DEFAULT 'N',
	"FL_EMPRES_ITP" CHAR(1) DEFAULT 'N',
	 CONSTRAINT "NN_ITP_ID_INSTIP_TIP" CHECK (id_instip_itp IS NOT NULL) ENABLE,
	 CONSTRAINT "NN_ITP_DS_INSTIP_TIP" CHECK (ds_instip_itp IS NOT NULL) ENABLE,
	 CONSTRAINT "PK_INSUMO_TIPO" PRIMARY KEY ("ID_INSTIP_ITP")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01"  ENABLE,
	 CONSTRAINT "CK_ITP_FL_INSTIP_TIP" CHECK (FL_INSTIP_ITP IN ('C','E','P','R','X','T','M','A','H','V','2')) ENABLE,
	 SUPPLEMENTAL LOG DATA (ALL) COLUMNS,
	 SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_512K_01" ;

CREATE INDEX "SIG_USER"."IDX$$_10430003" ON "SIG_USER"."INSUMO_TIPO" ("FL_INSTIP_ITP", "ID_INSTIP_ITP")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_10431204" ON "SIG_USER"."INSUMO_TIPO" ("FL_INSTIP_ITP")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."PK_INSUMO_TIPO" ON "SIG_USER"."INSUMO_TIPO" ("ID_INSTIP_ITP")
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_512K_01" ;

COMMENT ON COLUMN SIG_USER.INSUMO_TIPO.FL_INSTIP_ITP IS 'P-Papel/C-Cartão/E-Eletronico/R-Repasse/X-Itens Substituição/T-Terminais/M-Merchadising/A-Acessórios/H-Integração ERP/V-Convenio/2-Repasse ao Emissor - 2a via';
COMMENT ON COLUMN SIG_USER.INSUMO_TIPO.FL_CELULA_ITP IS 'informa se é celular';
COMMENT ON COLUMN SIG_USER.INSUMO_TIPO.FL_EMPRES_ITP IS 'informa se é item empresarial';
```
- gera_pedido
```sql
CREATE TABLE "SIG_USER"."GERA_PEDIDO"
   (	"ID_CLIENT_CLI" NUMBER NOT NULL ENABLE,
	"ID_CLINEG_CNG" NUMBER NOT NULL ENABLE,
	"ID_PEDIDO_PED" NUMBER,
	"DS_PARAMS_GER" VARCHAR2(4000),
	"DT_INICIO_GER" DATE DEFAULT SYSDATE NOT NULL ENABLE,
	"DT_FINALI_GER" DATE,
	"ID_GERPED_GPS" NUMBER,
	"ID_GERPED_GER" NUMBER NOT NULL ENABLE,
	"ID_MOTCAN_MCG" NUMBER,
	"DS_OUTMOT_GER" VARCHAR2(400),
	"NM_USUARI_GER" VARCHAR2(80),
	"DS_REMOTE_GER" VARCHAR2(30),
	"VL_QTDFUN_GER" NUMBER DEFAULT null,
	 CONSTRAINT "PK_ID_GERPED_GER" PRIMARY KEY ("ID_GERPED_GER")
  USING INDEX PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01"  ENABLE,
	 CONSTRAINT "FK_GER_CLI" FOREIGN KEY ("ID_CLIENT_CLI")
	  REFERENCES "SIG_USER"."CLIENTE" ("ID_CLIENT_CLI") ENABLE,
	 CONSTRAINT "FK_GER_CNG" FOREIGN KEY ("ID_CLINEG_CNG")
	  REFERENCES "SIG_USER"."CLIENTE_NEGOCIO" ("ID_CLINEG_CNG") ENABLE,
	 CONSTRAINT "FK_GER_PED" FOREIGN KEY ("ID_PEDIDO_PED")
	  REFERENCES "SIG_USER"."PEDIDO" ("ID_PEDIDO_PED") ENABLE,
	 CONSTRAINT "FK_GERPED_GPS" FOREIGN KEY ("ID_GERPED_GPS")
	  REFERENCES "SIG_USER"."GERA_PEDIDO_SOLICITACAO" ("ID_GERPED_GPS") ENABLE,
	 CONSTRAINT "FK_MOTCAN_MCG" FOREIGN KEY ("ID_MOTCAN_MCG")
	  REFERENCES "SIG_USER"."GERA_PEDIDO_MOT_CANC" ("ID_MOTCAN_MCG") ENABLE
   ) SEGMENT CREATION IMMEDIATE
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 134217728 NEXT 134217728 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_DAD_SIGUSER_128M_01" ;

CREATE INDEX "SIG_USER"."GERA_PEDIDO_IX01" ON "SIG_USER"."GERA_PEDIDO" ("ID_CLINEG_CNG")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE INDEX "SIG_USER"."IDX$$_222A0002" ON "SIG_USER"."GERA_PEDIDO" ("ID_PEDIDO_PED")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE INDEX "SIG_USER"."IDX_ID_GERPED_GPS" ON "SIG_USER"."GERA_PEDIDO" ("ID_GERPED_GPS")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE INDEX "SIG_USER"."IDX_VL_QTDFUN_GER" ON "SIG_USER"."GERA_PEDIDO" (NVL("VL_QTDFUN_GER",(-1)))
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE INDEX "SIG_USER"."IX_GER_CLI" ON "SIG_USER"."GERA_PEDIDO" ("ID_CLIENT_CLI")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;
  CREATE UNIQUE INDEX "SIG_USER"."PK_ID_GERPED_GER" ON "SIG_USER"."GERA_PEDIDO" ("ID_GERPED_GER")
  PCTFREE 10 INITRANS 20 MAXTRANS 255 COMPUTE STATISTICS
  STORAGE(INITIAL 524288 NEXT 524288 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TS_IND_SIGUSER_1M_01" ;

COMMENT ON TABLE SIG_USER.GERA_PEDIDO IS 'processo assincrono de geracao de pedidos';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.DS_PARAMS_GER IS 'parametros da geracao do pedido';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.DT_INICIO_GER IS 'data de inicio do processo';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.DT_FINALI_GER IS 'finalizacao do processo';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.ID_GERPED_GPS IS 'fk GERA_PEDIDO_SOLICITACAO';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.ID_GERPED_GER IS 'pk';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.DS_OUTMOT_GER IS 'descricao para outros motivos de cancelamento';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.NM_USUARI_GER IS 'Usuario que solicitou o cancelamento';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.DS_REMOTE_GER IS 'IP do usuario que solicitou o cancelamento';
COMMENT ON COLUMN SIG_USER.GERA_PEDIDO.VL_QTDFUN_GER IS 'Indica a quantidade de funcionários';
```

