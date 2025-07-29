# Documentação do Banco de Dados - Payable Node

## Visão Geral

O Sistema de Pagamentos Payable Node utiliza SQLite como banco de dados para armazenar informações de pagamentos. A configuração atual utiliza banco em memória para simplicidade de desenvolvimento, mas pode ser facilmente migrado para PostgreSQL ou MySQL em produção.

## Configuração Atual

### Banco de Dados
- **Tipo**: SQLite
- **Modo**: Em memória (`:memory:`)
- **ORM**: Sequelize com TypeScript
- **Auto-load**: Habilitado

### Configuração no Código

```typescript
// src/app.module.ts
SequelizeModule.forRoot({
  dialect: 'sqlite',
  host: ':memory:', // Dados perdidos ao reiniciar
  autoLoadModels: true,
  models: [PaymentModel],
})
```

## Schema do Banco de Dados

### Tabela: `PaymentModels`

Esta é a tabela principal que armazena todas as informações de pagamentos.

#### Estrutura da Tabela

| Coluna | Tipo | Nulo | Padrão | Chave | Descrição |
|--------|------|------|---------|-------|-----------|
| id | INTEGER | NÃO | AUTO_INCREMENT | PK | Identificador único |
| amount | DECIMAL | NÃO | - | - | Valor do pagamento |
| currency | VARCHAR(3) | NÃO | - | - | Código da moeda |
| status | VARCHAR(20) | NÃO | - | - | Status do pagamento |
| createdAt | DATETIME | NÃO | CURRENT_TIMESTAMP | - | Data de criação |
| updatedAt | DATETIME | NÃO | CURRENT_TIMESTAMP | - | Data de atualização |

#### SQL de Criação

```sql
CREATE TABLE PaymentModels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(20) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Modelo de Dados (Entity)

### PaymentModel

Implementação Sequelize-TypeScript:

```typescript
// src/payments/entities/payment.entity.ts
import { Column, Model, Table } from 'sequelize-typescript'

export type PaymentAttributes = {
  amount: number
  currency: string
  status: string
}

@Table
export class PaymentModel extends Model<PaymentAttributes> {
  @Column
  amount: number

  @Column
  currency: string

  @Column
  status: string
}
```

### Campos Detalhados

#### ID (Primary Key)
- **Tipo**: INTEGER
- **Auto Increment**: Sim
- **Único**: Sim
- **Nullable**: Não
- **Descrição**: Identificador único gerado automaticamente

#### Amount (Valor)
- **Tipo**: DECIMAL(10,2)
- **Nullable**: Não
- **Validação**: Deve ser numérico
- **Descrição**: Valor monetário do pagamento
- **Exemplos**: `150.75`, `-50.00` (estorno), `0.01`

#### Currency (Moeda)
- **Tipo**: VARCHAR(3)
- **Nullable**: Não
- **Formato**: Código ISO 4217
- **Exemplos**: `"BRL"`, `"USD"`, `"EUR"`
- **Descrição**: Código da moeda do pagamento

#### Status (Situação)
- **Tipo**: VARCHAR(20)
- **Nullable**: Não
- **Valores sugeridos**: 
  - `"pending"` - Pagamento pendente
  - `"completed"` - Pagamento concluído
  - `"failed"` - Pagamento falhou
  - `"cancelled"` - Pagamento cancelado
  - `"refunded"` - Pagamento estornado

#### CreatedAt (Data de Criação)
- **Tipo**: DATETIME
- **Nullable**: Não
- **Auto-gerenciado**: Sim
- **Formato**: ISO 8601
- **Exemplo**: `"2024-01-15T10:30:00.000Z"`

#### UpdatedAt (Data de Atualização)
- **Tipo**: DATETIME
- **Nullable**: Não
- **Auto-atualizado**: Sim
- **Formato**: ISO 8601
- **Atualizado**: A cada modificação do registro

## Operações de Banco de Dados

### Criar Pagamento

```typescript
// Service method
async create(createPaymentDto: CreatePaymentDto) {
  const payment = await this.paymentModel.create(createPaymentDto)
  return payment
}
```

```sql
-- SQL equivalente
INSERT INTO PaymentModels (amount, currency, status, createdAt, updatedAt)
VALUES (150.75, 'BRL', 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

### Listar Pagamentos

```typescript
// Service method
findAll() {
  return this.paymentModel.findAll()
}
```

```sql
-- SQL equivalente
SELECT id, amount, currency, status, createdAt, updatedAt
FROM PaymentModels
ORDER BY createdAt DESC;
```

### Buscar por ID

```typescript
// Service method (implementação sugerida)
findOne(id: number) {
  return this.paymentModel.findByPk(id)
}
```

```sql
-- SQL equivalente
SELECT id, amount, currency, status, createdAt, updatedAt
FROM PaymentModels
WHERE id = 1;
```

## Exemplos de Dados

### Registros de Exemplo

```json
[
  {
    "id": 1,
    "amount": 150.75,
    "currency": "BRL",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  {
    "id": 2,
    "amount": 89.99,
    "currency": "USD",
    "status": "pending",
    "createdAt": "2024-01-15T11:15:00.000Z",
    "updatedAt": "2024-01-15T11:15:00.000Z"
  },
  {
    "id": 3,
    "amount": -50.00,
    "currency": "BRL",
    "status": "completed",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
]
```

### Casos de Uso Comuns

#### Pagamento com Cartão
```json
{
  "amount": 299.90,
  "currency": "BRL",
  "status": "pending"
}
```

#### Pagamento PIX
```json
{
  "amount": 150.00,
  "currency": "BRL",
  "status": "completed"
}
```

#### Estorno
```json
{
  "amount": -299.90,
  "currency": "BRL",  
  "status": "completed"
}
```

## Validações e Constraints

### Validações Implementadas

1. **Campos Obrigatórios**: Todos os campos são obrigatórios
2. **Tipos de Dados**: Validação automática pelo Sequelize
3. **Auto-incremento**: ID gerado automaticamente

### Validações Sugeridas (Futuras)

```typescript
// Exemplo de validações avançadas
@Table
export class PaymentModel extends Model<PaymentAttributes> {
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: -999999.99,
      max: 999999.99
    }
  })
  amount: number

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    validate: {
      len: [3, 3],
      isAlpha: true,
      isUppercase: true
    }
  })
  currency: string

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['pending', 'completed', 'failed', 'cancelled', 'refunded']]
    }
  })
  status: string
}
```

## Índices e Performance

### Índices Sugeridos

```sql
-- Índice para consultas por status
CREATE INDEX idx_payments_status ON PaymentModels(status);

-- Índice para consultas por data
CREATE INDEX idx_payments_created_at ON PaymentModels(createdAt);

-- Índice para consultas por moeda
CREATE INDEX idx_payments_currency ON PaymentModels(currency);

-- Índice composto para relatórios
CREATE INDEX idx_payments_status_currency ON PaymentModels(status, currency);
```

## Migração para Produção

### PostgreSQL

#### Configuração

```typescript
// src/app.module.ts (Produção)
SequelizeModule.forRoot({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'payable',
  autoLoadModels: true,
  models: [PaymentModel],
  synchronize: false, // Usar migrations em produção
})
```

#### Migration Script

```sql
-- migrations/001-create-payments-table.sql
CREATE TABLE IF NOT EXISTS "PaymentModels" (
  "id" SERIAL PRIMARY KEY,
  "amount" DECIMAL(10,2) NOT NULL,
  "currency" VARCHAR(3) NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS "idx_payments_status" ON "PaymentModels"("status");
CREATE INDEX IF NOT EXISTS "idx_payments_created_at" ON "PaymentModels"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_payments_currency" ON "PaymentModels"("currency");
```

### MySQL

#### Configuração

```typescript
SequelizeModule.forRoot({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'payable',
  autoLoadModels: true,
  models: [PaymentModel],
})
```

## Backup e Restauração

### SQLite (Desenvolvimento)

```bash
# Backup (se usando arquivo)
cp database.sqlite backup-$(date +%Y%m%d).sqlite

# Restauração
cp backup-20240115.sqlite database.sqlite
```

### PostgreSQL (Produção)

```bash
# Backup
pg_dump -h localhost -U postgres -d payable > backup-$(date +%Y%m%d).sql

# Restauração
psql -h localhost -U postgres -d payable < backup-20240115.sql
```

## Monitoramento e Logs

### Queries Lentas

```typescript
// Configuração para log de queries
SequelizeModule.forRoot({
  // ... outras configurações
  logging: (sql, timing) => {
    if (timing > 1000) { // Queries > 1s
      console.warn(`Slow query: ${sql} (${timing}ms)`)
    }
  }
})
```

### Métricas Sugeridas

- Número total de pagamentos
- Pagamentos por status
- Volume financeiro por moeda
- Tempo médio de criação
- Queries mais executadas

## Expansões Futuras

### Tabelas Adicionais Sugeridas

#### Users (Usuários)
```sql
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### PaymentMethods (Métodos de Pagamento)
```sql
CREATE TABLE PaymentMethods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type VARCHAR(20) NOT NULL, -- 'credit_card', 'pix', 'boleto'
  provider VARCHAR(50), -- 'visa', 'mastercard', etc
  lastFourDigits VARCHAR(4),
  userId INTEGER REFERENCES Users(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Relationships (Relacionamentos)
```sql
-- Adicionar userId aos pagamentos
ALTER TABLE PaymentModels ADD COLUMN userId INTEGER REFERENCES Users(id);
ALTER TABLE PaymentModels ADD COLUMN paymentMethodId INTEGER REFERENCES PaymentMethods(id);
```

## Troubleshooting

### Problemas Comuns

#### 1. Tabela não encontrada
```bash
# Erro: Table 'PaymentModels' doesn't exist
# Solução: Verificar se autoLoadModels está habilitado
```

#### 2. Dados perdidos após restart
```bash
# Causa: Banco em memória (:memory:)
# Solução: Usar arquivo SQLite ou banco externo
```

#### 3. Conflito de tipos
```bash
# Erro: Type mismatch
# Solução: Verificar tipos no DTO vs Entity
```

### Debug de Queries

```typescript
// Habilitar logs de SQL
SequelizeModule.forRoot({
  // ...
  logging: console.log, // Mostra todas as queries
})
```

## Referências

- [Sequelize Documentation](https://sequelize.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [ISO 4217 Currency Codes](https://en.wikipedia.org/wiki/ISO_4217)

---

**Versão**: 1.0.0  
**Autor**: Fernando Britto  
**Última atualização**: Janeiro 2024 