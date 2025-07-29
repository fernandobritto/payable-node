# Arquitetura do Sistema - Payable Node

## Visão Geral

O Sistema de Pagamentos Payable Node é uma aplicação backend desenvolvida com arquitetura modular baseada no framework NestJS. O sistema segue os princípios de Clean Architecture e Domain-Driven Design (DDD) para garantir manutenibilidade e escalabilidade.

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  (Web Apps, Mobile Apps, Third-party Integrations)        │
└─────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Controllers   │  │   Middlewares   │  │   Guards    │  │
│  │   (REST API)    │  │   (Validation)  │  │   (Auth)    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │    Services     │  │      DTOs       │  │  Use Cases  │  │
│  │ (Business Logic)│  │ (Data Transfer) │  │   (Flows)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     INFRASTRUCTURE LAYER                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Database      │  │   HTTP Client   │  │   External  │  │
│  │   (SQLite)      │  │    (Axios)      │  │   APIs      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Componentes Principais

### 1. Application Module (app.module.ts)

**Responsabilidade**: Configuração central da aplicação

**Configurações**:
- Importação de módulos de feature
- Configuração do banco de dados Sequelize
- Configuração de providers globais

```typescript
@Module({
  imports: [
    PaymentsModule,
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      host: ':memory:',
      autoLoadModels: true,
      models: [PaymentModel],
    }),
  ],
})
export class AppModule {}
```

### 2. Payments Module

**Estrutura**:
```
payments/
├── dto/                     # Data Transfer Objects
├── entities/               # Domain Models / Database Entities
├── payments.controller.ts  # HTTP Request Handlers
├── payments.service.ts     # Business Logic
├── payments.module.ts      # Module Configuration
└── *.spec.ts              # Unit Tests
```

#### 2.1 Controller Layer

**Responsabilidade**: Manipulação de requisições HTTP e respostas

**Endpoints Implementados**:
- `POST /payments` - Criação de pagamentos
- `GET /payments` - Listagem de pagamentos
- `GET /payments/:id` - Busca por ID (placeholder)
- `PATCH /payments/:id` - Atualização (placeholder)
- `DELETE /payments/:id` - Remoção (placeholder)

#### 2.2 Service Layer

**Responsabilidade**: Lógica de negócio e orquestração

**Funcionalidades**:
- Validação de regras de negócio
- Persistência de dados
- Integração com API bancária externa
- Transformação de dados

#### 2.3 Data Layer

**Entity**: `PaymentModel`
- Mapeamento objeto-relacional usando Sequelize
- Definição de schema do banco de dados
- Configuração de relacionamentos (futuro)

## Fluxo de Dados

### Fluxo de Criação de Pagamento

```
1. Client Request
   │
   ▼
2. PaymentsController.create()
   │
   ▼
3. Data Validation (DTO)
   │
   ▼
4. PaymentsService.create()
   │
   ├── 4a. PaymentModel.create() → SQLite Database
   │
   └── 4b. HttpService.post() → Bank API (localhost:3001)
   │
   ▼
5. Response to Client
```

### Diagrama de Sequência - Criar Pagamento

```
Client          Controller       Service         Database      Bank API
  │                 │              │               │             │
  │─── POST ───────→│              │               │             │
  │   /payments     │              │               │             │
  │                 │              │               │             │
  │                 │──── create ──→│               │             │
  │                 │   (DTO)       │               │             │
  │                 │               │               │             │
  │                 │               │── save ──────→│             │
  │                 │               │   payment     │             │
  │                 │               │               │             │
  │                 │               │←── entity ────│             │
  │                 │               │   created     │             │
  │                 │               │               │             │
  │                 │               │── notify ─────────────────→│
  │                 │               │   bank API    │             │
  │                 │               │               │             │
  │                 │←── payment ───│               │             │
  │                 │   entity      │               │             │
  │                 │               │               │             │
  │←─── 201 ────────│               │               │             │
  │    Created      │               │               │             │
```

## Decisões de Arquitetura

### 1. Framework: NestJS

**Razões**:
- **Estrutura Modular**: Facilita organização e manutenção
- **Decorators**: Sintaxe limpa e expressiva
- **Dependency Injection**: Facilita testes e desacoplamento
- **TypeScript**: Type safety e melhor experiência de desenvolvimento
- **Ecosystem**: Rica ecossistema de módulos e integrações

### 2. Banco de Dados: SQLite

**Razões**:
- **Simplicidade**: Zero configuração para desenvolvimento
- **Portabilidade**: Arquivo único, fácil backup e migração
- **Performance**: Adequado para cargas moderadas
- **Desenvolvimento**: Ideal para prototipagem rápida

**Limitações**:
- Não adequado para alta concorrência
- Sem recursos avançados de replicação
- Recomendado migrar para PostgreSQL/MySQL em produção

### 3. ORM: Sequelize

**Razões**:
- **TypeScript Support**: Excelente integração com TS
- **Migrations**: Sistema robusto de migrações
- **Associations**: Facilita relacionamentos complexos
- **Validation**: Validações a nível de modelo

### 4. HTTP Client: Axios

**Razões**:
- **Integração NestJS**: Módulo oficial @nestjs/axios
- **Interceptors**: Facilita logging e tratamento de erros
- **Observables**: Integração com RxJS
- **TypeScript**: Suporte nativo

## Padrões de Design Utilizados

### 1. Repository Pattern
- Abstração da camada de dados
- Facilita testes unitários
- Implementado via Sequelize models

### 2. Dependency Injection
- Desacoplamento entre componentes
- Facilita mocking em testes
- Nativo do NestJS

### 3. DTO Pattern (Data Transfer Object)
- Validação de entrada
- Transformação de dados
- Controle de interface pública

### 4. Module Pattern
- Encapsulamento de funcionalidades
- Configuração centralizada
- Facilita lazy loading

## Estrutura de Diretórios

```
src/
├── main.ts                    # Entry point da aplicação
├── app.module.ts             # Módulo raiz
└── payments/                 # Feature module
    ├── dto/
    │   ├── create-payment.dto.ts
    │   └── update-payment.dto.ts
    ├── entities/
    │   └── payment.entity.ts
    ├── payments.controller.ts
    ├── payments.service.ts
    ├── payments.module.ts
    └── *.spec.ts
```

## Configurações Importantes

### Database Configuration

```typescript
// app.module.ts
SequelizeModule.forRoot({
  dialect: 'sqlite',
  host: ':memory:',        // Em memória - dados perdidos ao reiniciar
  autoLoadModels: true,    // Carregamento automático de models
  models: [PaymentModel],  // Lista de models registrados
})
```

### HTTP Client Configuration

```typescript
// payments.module.ts
HttpModule.register({
  baseURL: 'http://localhost:3001',  // API bancária mock
  timeout: 5000,                     // Timeout de 5 segundos
})
```

## Segurança

### Implementado
- Validação de dados de entrada via DTOs
- TypeScript para type safety

### Não Implementado (Roadmap)
- Autenticação JWT
- Autorização baseada em roles
- Rate limiting
- Input sanitization
- SQL injection protection (Sequelize oferece proteção básica)

## Performance

### Otimizações Atuais
- Banco em memória para acesso rápido
- Conexão HTTP reutilizada (HTTP Keep-Alive)

### Gargalos Identificados
- Banco SQLite não adequado para alta concorrência
- Sem cache de consultas
- Sem paginação nas listagens
- Operações síncronas com API bancária

### Melhorias Sugeridas
- Implementar cache Redis
- Queue system para processamento assíncrono
- Paginação e filtros em listagens
- Connection pooling para banco de dados

## Escalabilidade

### Limitações Atuais
- Aplicação monolítica
- Banco single-node
- Estado em memória perdido ao reiniciar

### Estratégias de Escalonamento
1. **Horizontal**: Load balancer + múltiplas instâncias
2. **Vertical**: Upgrade de recursos da máquina
3. **Database**: Migração para PostgreSQL com replicas
4. **Microservices**: Separação de domínios

## Monitoramento e Observabilidade

### Implementado
- Logs básicos do NestJS

### Recomendado
- Estruturação de logs (winston)
- Métricas de performance (Prometheus)
- Health checks
- Distributed tracing
- Error tracking (Sentry)

## Testes

### Estratégia Atual
- Testes unitários com Jest
- Testes E2E configurados
- Mocks básicos configurados

### Cobertura de Testes
- Controllers: Testes básicos
- Services: Configurado mas com problemas de dependências
- E2E: Teste básico de health check

### Melhorias Necessárias
- Corrigir testes unitários do service
- Adicionar testes de integração
- Implementar testes de contrato
- Cobertura de código > 80%

## Documentação Relacionada

- [README.md](../README.md) - Documentação geral
- [API.md](./API.md) - Documentação da API
- [SETUP.md](./SETUP.md) - Guia de configuração
- [DATABASE.md](./DATABASE.md) - Documentação do banco

---

**Versão**: 1.0.0  
**Autor**: Fernando Britto  
**Última atualização**: Janeiro 2024 