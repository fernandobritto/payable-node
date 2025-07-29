# Documentação da API - Sistema de Pagamentos

## Visão Geral

A API do Sistema de Pagamentos fornece endpoints RESTful para gerenciar transações financeiras. Todas as respostas são retornadas em formato JSON.

**Base URL**: `http://localhost:8084`

## Autenticação

Atualmente a API não implementa autenticação. Todos os endpoints são públicos.

## Headers Padrão

```http
Content-Type: application/json
Accept: application/json
```

## Endpoints

### 1. Criar Pagamento

Cria um novo pagamento no sistema.

**Endpoint**: `POST /payments`

**Request Body**:
```json
{
  "amount": number,
  "currency": string,
  "status": string
}
```

**Campos Obrigatórios**:
- `amount`: Valor do pagamento (número decimal)
- `currency`: Código da moeda (string, ex: "BRL", "USD")
- `status`: Status do pagamento (string, ex: "pending", "completed", "failed")

**Exemplo de Requisição**:
```bash
curl -X POST http://localhost:8084/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.75,
    "currency": "BRL",
    "status": "pending"
  }'
```

**Resposta de Sucesso** (201 Created):
```json
{
  "id": 1,
  "amount": 150.75,
  "currency": "BRL",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Todos os Pagamentos

Retorna uma lista com todos os pagamentos cadastrados.

**Endpoint**: `GET /payments`

**Parâmetros**: Nenhum

**Exemplo de Requisição**:
```bash
curl -X GET http://localhost:8084/payments
```

**Resposta de Sucesso** (200 OK):
```json
[
  {
    "id": 1,
    "amount": 150.75,
    "currency": "BRL",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "amount": 89.99,
    "currency": "USD",
    "status": "completed",
    "createdAt": "2024-01-15T11:15:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
]
```

### 3. Buscar Pagamento por ID

Retorna os detalhes de um pagamento específico.

**Endpoint**: `GET /payments/:id`

**Parâmetros de Rota**:
- `id`: ID numérico do pagamento

**Exemplo de Requisição**:
```bash
curl -X GET http://localhost:8084/payments/1
```

**Resposta de Sucesso** (200 OK):
```json
"This action returns a #1 payment"
```

**Nota**: *Este endpoint atualmente retorna uma string placeholder. Implementação completa pendente.*

### 4. Atualizar Pagamento

Atualiza parcialmente os dados de um pagamento existente.

**Endpoint**: `PATCH /payments/:id`

**Parâmetros de Rota**:
- `id`: ID numérico do pagamento

**Request Body** (campos opcionais):
```json
{
  "amount": number,
  "currency": string,
  "status": string
}
```

**Exemplo de Requisição**:
```bash
curl -X PATCH http://localhost:8084/payments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

**Resposta de Sucesso** (200 OK):
```json
"This action updates a #1 payment"
```

**Nota**: *Este endpoint atualmente retorna uma string placeholder. Implementação completa pendente.*

### 5. Remover Pagamento

Remove um pagamento do sistema.

**Endpoint**: `DELETE /payments/:id`

**Parâmetros de Rota**:
- `id`: ID numérico do pagamento

**Exemplo de Requisição**:
```bash
curl -X DELETE http://localhost:8084/payments/1
```

**Resposta de Sucesso** (200 OK):
```json
"This action removes a #1 payment"
```

**Nota**: *Este endpoint atualmente retorna uma string placeholder. Implementação completa pendente.*

## Schemas de Dados

### Payment Schema

```typescript
interface Payment {
  id: number;              // Identificador único (auto increment)
  amount: number;          // Valor do pagamento
  currency: string;        // Código da moeda
  status: string;          // Status do pagamento
  createdAt: Date;         // Data de criação (auto)
  updatedAt: Date;         // Data da última atualização (auto)
}
```

### CreatePaymentDto

```typescript
interface CreatePaymentDto {
  amount: number;          // Obrigatório
  currency: string;        // Obrigatório
  status: string;          // Obrigatório
}
```

### UpdatePaymentDto

```typescript
interface UpdatePaymentDto {
  amount?: number;         // Opcional
  currency?: string;       // Opcional
  status?: string;         // Opcional
}
```

## Códigos de Status HTTP

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| 200 | OK | Requisição processada com sucesso |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados de entrada inválidos |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

## Validação de Dados

### Regras de Validação

1. **amount**:
   - Deve ser um número
   - Valores negativos são aceitos (para estornos)
   
2. **currency**:
   - Deve ser uma string
   - Recomenda-se usar códigos ISO 4217 (BRL, USD, EUR)
   
3. **status**:
   - Deve ser uma string
   - Valores sugeridos: "pending", "completed", "failed", "cancelled"

### Exemplo de Erro de Validação

```json
{
  "statusCode": 400,
  "message": [
    "amount must be a number",
    "currency should not be empty"
  ],
  "error": "Bad Request"
}
```

## Integração com API Bancária

Quando um pagamento é criado, o sistema automaticamente envia os dados para uma API bancária mock rodando na porta 3001.

**Dados Enviados**:
```json
POST http://localhost:3001/payments
{
  "amount": 150.75,
  "currency": "BRL",
  "status": "pending"
}
```

## Exemplos de Uso

### Fluxo Completo de Pagamento

```bash
# 1. Criar um pagamento
curl -X POST http://localhost:8084/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250.00,
    "currency": "BRL",
    "status": "pending"
  }'

# 2. Listar todos os pagamentos
curl -X GET http://localhost:8084/payments

# 3. Atualizar status do pagamento
curl -X PATCH http://localhost:8084/payments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'

# 4. Consultar pagamento específico  
curl -X GET http://localhost:8084/payments/1
```

### Casos de Uso Comuns

#### 1. Processar Pagamento com Cartão

```json
POST /payments
{
  "amount": 99.90,
  "currency": "BRL",
  "status": "pending"
}
```

#### 2. Registrar Estorno

```json
POST /payments
{
  "amount": -99.90,
  "currency": "BRL",
  "status": "completed"
}
```

#### 3. Atualizar Status após Processamento

```json
PATCH /payments/1
{
  "status": "completed"
}
```

## Suporte

Para dúvidas sobre a API, consulte:
- [README.md](../README.md) - Documentação geral do projeto
- [Código fonte](../src/payments/) - Implementação dos endpoints

---

**Versão da API**: 1.0.0  
**Última atualização**: Janeiro 2024 