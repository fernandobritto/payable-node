# Sistema de Pagamentos - Payable Node

Uma API REST para gerenciamento de pagamentos desenvolvida com NestJS, TypeScript e SQLite.

## 📋 Sobre o Projeto

Este projeto é um sistema de pagamentos que fornece uma API REST completa para gerenciar transações financeiras. A aplicação utiliza o framework NestJS com TypeScript e integra-se com uma API bancária simulada para processar pagamentos.

### Principais Funcionalidades

- ✅ CRUD completo de pagamentos
- ✅ Integração com API bancária externa
- ✅ Persistência em banco SQLite
- ✅ Validação de dados com DTOs
- ✅ Arquitetura modular e escalável
- ✅ Testes unitários e E2E configurados

## 🏗️ Arquitetura

```
src/
├── main.ts                    # Ponto de entrada da aplicação
├── app.module.ts             # Módulo principal
└── payments/                 # Módulo de pagamentos
    ├── dto/                  # Data Transfer Objects
    │   ├── create-payment.dto.ts
    │   └── update-payment.dto.ts
    ├── entities/             # Entidades do banco de dados
    │   └── payment.entity.ts
    ├── payments.controller.ts # Controller REST
    ├── payments.service.ts   # Lógica de negócio
    ├── payments.module.ts    # Configuração do módulo
    └── *.spec.ts            # Testes unitários
```

## 🚀 Tecnologias Utilizadas

- **Framework**: NestJS 10.x
- **Linguagem**: TypeScript 5.x
- **Banco de Dados**: SQLite (em memória)
- **ORM**: Sequelize com sequelize-typescript
- **HTTP Client**: Axios (@nestjs/axios)
- **Testes**: Jest
- **Linting**: ESLint + Prettier
- **Gerenciador de Pacotes**: pnpm

## ⚙️ Pré-requisitos

- Node.js >= 18.x
- pnpm >= 8.x

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd payable-node
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Inicie o servidor bancário mock (Terminal 1)
```bash
pnpm run bank-api
```
> O servidor mock será executado na porta 3001

### 4. Inicie a aplicação (Terminal 2)
```bash
# Desenvolvimento
pnpm run start:dev

# Produção
pnpm run start:prod

# Debug
pnpm run start:debug
```

A aplicação estará disponível em: `http://localhost:8084`

## 📡 API Endpoints

### Pagamentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST   | `/payments` | Criar novo pagamento |
| GET    | `/payments` | Listar todos os pagamentos |
| GET    | `/payments/:id` | Buscar pagamento por ID |
| PATCH  | `/payments/:id` | Atualizar pagamento |
| DELETE | `/payments/:id` | Remover pagamento |

### Exemplo de Requisição

**POST /payments**
```json
{
  "amount": 100.50,
  "currency": "BRL",
  "status": "pending"
}
```

**Resposta:**
```json
{
  "id": 1,
  "amount": 100.50,
  "currency": "BRL",
  "status": "pending",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## 🗄️ Modelo de Dados

### Payment Entity

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | number | Sim (auto) | Identificador único |
| amount | number | Sim | Valor do pagamento |
| currency | string | Sim | Moeda (ex: BRL, USD) |
| status | string | Sim | Status do pagamento |
| createdAt | Date | Sim (auto) | Data de criação |
| updatedAt | Date | Sim (auto) | Data de atualização |

## 🧪 Testes

### Executar todos os testes
```bash
pnpm run test
```

### Testes com watch mode
```bash
pnpm run test:watch
```

### Testes E2E
```bash
pnpm run test:e2e
```

### Coverage
```bash
pnpm run test:cov
```

## 🔍 Linting e Formatação

### Executar linting
```bash
pnpm run lint
```

### Formatação automática
```bash
pnpm run format
```

## 🏗️ Build

### Build de produção
```bash
pnpm run build
```

Os arquivos serão gerados no diretório `dist/`

## 🔄 Fluxo de Funcionamento

1. **Criação de Pagamento**: Cliente envia dados via POST /payments
2. **Persistência**: Dados são salvos no banco SQLite
3. **Integração Bancária**: Sistema comunica com API bancária mock (porta 3001)
4. **Resposta**: Retorna dados do pagamento criado com ID gerado

## 📋 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| start | `pnpm start` | Inicia aplicação em modo produção |
| start:dev | `pnpm start:dev` | Inicia em modo desenvolvimento (watch) |
| start:debug | `pnpm start:debug` | Inicia em modo debug |
| build | `pnpm build` | Gera build de produção |
| test | `pnpm test` | Executa testes unitários |
| test:e2e | `pnpm test:e2e` | Executa testes E2E |
| test:cov | `pnpm test:cov` | Executa testes com coverage |
| lint | `pnpm lint` | Executa linting |
| format | `pnpm format` | Formata código |
| bank-api | `pnpm bank-api` | Inicia servidor bancário mock |

## ⚠️ Problemas Conhecidos

### Testes Unitários
- Os testes unitários do PaymentsService possuem problemas de dependências
- Necessário configurar mocks adequados para PaymentModelRepository e HttpService

### Banco de Dados
- Utiliza SQLite em memória - dados são perdidos ao reiniciar
- Para persistência, configure SQLite com arquivo ou outro banco

## 🔧 Configurações

### Porta da Aplicação
A aplicação roda na porta `8084` por padrão. Para alterar:
```bash
PORT=3000 pnpm start:dev
```

### Banco de Dados
Configurado em `src/app.module.ts`:
```typescript
SequelizeModule.forRoot({
  dialect: 'sqlite',
  host: ':memory:', // Em memória
  autoLoadModels: true,
  models: [PaymentModel],
})
```

### API Bancária Mock
Configurada em `src/payments/payments.module.ts`:
```typescript
HttpModule.register({
  baseURL: 'http://localhost:3001',
})
```

## 📁 Estrutura de Arquivos

```
payable-node/
├── src/                      # Código fonte
├── test/                     # Testes E2E
├── dist/                     # Build de produção
├── node_modules/             # Dependências
├── prompts/                  # Prompts de IA
├── bank.json                 # Dados mock da API bancária
├── package.json              # Configurações do projeto
├── tsconfig.json             # Configurações TypeScript
├── nest-cli.json             # Configurações NestJS CLI
├── .eslintrc.js              # Configurações ESLint
├── .prettierrc               # Configurações Prettier
└── README.md                 # Documentação
```

## 👨‍💻 Desenvolvimento

### Padrões de Código
- Utiliza ESLint e Prettier para padronização
- Segue convenções do NestJS
- TypeScript strict mode desabilitado para flexibilidade

### Estrutura de Commits
Recomenda-se seguir o padrão de commits convencionais.

## 📄 Licença

Este projeto está sob licença UNLICENSED.

---

**Autor**: Fernando Britto  
**Versão**: 0.0.1
