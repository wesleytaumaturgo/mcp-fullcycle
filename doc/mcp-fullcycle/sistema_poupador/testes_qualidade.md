# Testes e Qualidade

## Estratégia de Testes

O projeto inclui uma suíte robusta de testes compatível com Java 21:

### Testes Unitários
- **JUnit 5** (junit-jupiter): Framework principal
- **Mockito** (mockito-core, mockito-junit-jupiter): Mocks e stubs
- **AssertJ**: Asserções fluentes e legíveis

### Testes de Integração
- **TestContainers**: Oracle Free para testes reais de banco
- **Spring Boot Test**: Contexto de aplicação
- **WireMock** (3.4.2): Mock de serviços externos

### Testes de API
- **JSON Path**: Validação de responses JSON
- **Spring MockMvc**: Testes de endpoints
- **RestAssured**: Testes de contrato de API

## Configuração de Build

### Maven Surefire Plugin (3.2.5)
- Execução de testes unitários
- Configurações específicas para Java 21
- Encoding UTF-8
- Perfis de teste

### Maven Failsafe Plugin (3.2.5)
- Testes de integração
- Separação de unitários e integração
- Configurações Java 21 (--add-opens)

## Cobertura de Testes

### Ferramentas
- **JaCoCo**: Plugin Maven para medição
- **SonarQube**: Análise de qualidade e cobertura
- **IDE Integration**: Visualização em IntelliJ

### Metas de Cobertura
- **Unitários**: >80%
- **Integração**: >70%
- **Total**: >75%

### Relatórios
- HTML reports gerados automaticamente
- Integração com CI/CD
- Alertas para cobertura baixa

## Testes por Camada

### Controller Layer
```java
@SpringBootTest
@AutoConfigureMockMvc
class PedidoControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldCalculatePoupador() throws Exception {
        mockMvc.perform(post("/api/pedidos/calcular")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"valor\": 100.0}"))
                .andExpect(status().isOk());
    }
}
```

### Service Layer
```java
@ExtendWith(MockitoExtension.class)
class CalculoMensalServiceTest {
    @Mock
    private PedidoRepository repository;
    
    @InjectMocks
    private CalculoMensalService service;
    
    @Test
    void shouldCalculateMonthlyValue() {
        // Given
        when(repository.findById(any())).thenReturn(Optional.of(pedido));
        
        // When
        BigDecimal result = service.calcularMensal(1L);
        
        // Then
        assertThat(result).isEqualByComparingTo(new BigDecimal("150.00"));
    }
}
```

### Repository Layer
```java
@DataJpaTest
class PedidoRepositoryTest {
    @Autowired
    private PedidoRepository repository;
    
    @Test
    void shouldFindPedidosByStatus() {
        // Given
        Pedido pedido = createTestPedido();
        repository.save(pedido);
        
        // When
        List<Pedido> result = repository.findByStatus("PENDENTE");
        
        // Then
        assertThat(result).hasSize(1);
    }
}
```

## TestContainers para Oracle

### Configuração
```java
@Testcontainers
@SpringBootTest
class PedidoIntegrationTest {
    
    @Container
    static OracleContainer oracle = new OracleContainer("gvenzl/oracle-free:23.3-slim-faststart")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", oracle::getJdbcUrl);
        registry.add("spring.datasource.username", oracle::getUsername);
        registry.add("spring.datasource.password", oracle::getPassword);
    }
}
```

### Benefícios
- Testes realistas com Oracle
- Isolamento completo entre testes
- Setup automático do banco
- Sem dependência de ambiente externo

## Qualidade de Código

### Métricas
- **Complexidade Ciclomática**: <10 por método
- **Cobertura de Branches**: >80%
- **Dívida Técnica**: Monitorada e reduzida
- **Duplicação de Código**: <3%

### Análise Estática
- **SonarQube**: Regras de qualidade
- **SpotBugs**: Detecção de bugs
- **Checkstyle**: Padrões de código
- **PMD**: Análise de código

### Code Reviews
- Pull requests obrigatórios
- Aprovação de pelo menos 2 devs
- Checklist de qualidade
- Testes automatizados no CI

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: mvn test

- name: Run Integration Tests
  run: mvn verify -Pintegration-test

- name: Generate Coverage Report
  run: mvn jacoco:report

- name: SonarQube Analysis
  run: mvn sonar:sonar
```

### Gates de Qualidade
- Cobertura mínima: 80%
- Nenhum teste falhando
- Zero vulnerabilidades críticas
- Code smells <10

Esta estratégia garante alta qualidade, confiabilidade e manutenibilidade do sistema.
