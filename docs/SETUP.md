# Guia de Configuração - Payable Node

Este guia fornece instruções detalhadas para configurar, instalar e executar o Sistema de Pagamentos Payable Node em ambiente de desenvolvimento e produção.

## 📋 Pré-requisitos

### Requisitos Obrigatórios

- **Node.js**: >= 18.0.0 
- **pnpm**: >= 8.0.0
- **Git**: Para controle de versão
- **Terminal/CLI**: Para execução de comandos

### Verificação de Versões

```bash
# Verificar versão do Node.js
node --version

# Verificar versão do pnpm
pnpm --version

# Se pnpm não estiver instalado:
npm install -g pnpm
```

### Sistemas Operacionais Suportados

- ✅ Linux (Ubuntu 20.04+, CentOS 8+)
- ✅ macOS (10.15+)
- ✅ Windows 10/11 (com WSL2 recomendado)

## 🚀 Instalação Rápida

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd payable-node
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Executar em Modo Desenvolvimento

```bash
# Terminal 1: Iniciar API bancária mock
pnpm run bank-api

# Terminal 2: Iniciar aplicação
pnpm run start:dev
```

### 4. Verificar Instalação

```bash
# Testar se a aplicação está rodando
curl http://localhost:8084/payments

# Resposta esperada: []
```

## 🔧 Configuração Detalhada

### Estrutura de Configuração

O projeto utiliza configuração baseada em código, sem necessidade de arquivos `.env` para configurações básicas.

**Configurações Principais**:

| Configuração | Valor Padrão | Descrição |
|--------------|--------------|-----------|
| Porta da API | 8084 | Porta HTTP da aplicação |
| Porta do Mock | 3001 | Porta da API bancária simulada |
| Banco de Dados | SQLite (memória) | Banco de dados local |
| Base URL Mock | http://localhost:3001 | URL da API bancária |

### Configuração de Ambiente

#### Desenvolvimento

```bash
# Variáveis de ambiente opcionais
export PORT=8084
export NODE_ENV=development

# Iniciar em modo desenvolvimento
pnpm run start:dev
```

#### Produção

```bash
# Configurações de produção
export PORT=8080
export NODE_ENV=production

# Build e execução
pnpm run build
pnpm run start:prod
```

## 📂 Estrutura do Projeto

```
payable-node/
├── src/                      # Código fonte
│   ├── main.ts              # Entry point
│   ├── app.module.ts        # Módulo principal  
│   └── payments/            # Módulo de pagamentos
├── test/                    # Testes E2E
├── docs/                    # Documentação
├── dist/                    # Build de produção
├── node_modules/            # Dependências
├── bank.json               # Dados mock
├── package.json            # Configurações do projeto
├── tsconfig.json           # Configuração TypeScript
└── README.md               # Documentação principal
```

## 🖥️ Scripts de Desenvolvimento

### Scripts Principais

```bash
# Desenvolvimento com hot reload
pnpm run start:dev

# Execução normal
pnpm start

# Execução de produção
pnpm run start:prod

# Build para produção
pnpm run build

# API bancária mock
pnpm run bank-api
```

### Scripts de Teste

```bash
# Testes unitários
pnpm run test

# Testes em modo watch
pnpm run test:watch

# Testes E2E
pnpm run test:e2e

# Coverage de testes
pnpm run test:cov
```

### Scripts de Qualidade

```bash
# Linting
pnpm run lint

# Formatação de código
pnpm run format
```

## 🔍 Solução de Problemas

### Problemas Comuns

#### 1. Porta já em uso

**Erro**: `EADDRINUSE: address already in use :::8084`

**Solução**:
```bash
# Encontrar processo usando a porta
lsof -ti:8084

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3000 pnpm run start:dev
```

#### 2. Dependências não encontradas

**Erro**: `Module not found` ou `Cannot resolve dependency`

**Solução**:
```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### 3. Problemas de permissão (Linux/macOS)

**Erro**: `Permission denied`

**Solução**:
```bash
# Dar permissão de execução
chmod +x node_modules/.bin/*

# Ou usar sudo (não recomendado)
sudo pnpm install
```

#### 4. API bancária não acessível

**Erro**: `connect ECONNREFUSED 127.0.0.1:3001`

**Solução**:
```bash
# Verificar se API mock está rodando
curl http://localhost:3001/payments

# Iniciar API mock se necessário
pnpm run bank-api
```

### Logs de Debug

#### Habilitar logs detalhados

```bash
# Debug da aplicação
DEBUG=* pnpm run start:dev

# Logs do NestJS
pnpm run start:debug
```

#### Verificar logs

```bash
# Logs em tempo real
tail -f logs/application.log

# Filtrar logs de erro
grep "ERROR" logs/application.log
```

## 🚀 Deploy em Produção

### Build de Produção

```bash
# 1. Instalar dependências de produção
pnpm install --prod

# 2. Gerar build
pnpm run build

# 3. Verificar arquivos gerados
ls -la dist/
```

### Deploy Manual

```bash
# 1. Copiar arquivos para servidor
scp -r dist/ user@server:/opt/payable-node/
scp package.json user@server:/opt/payable-node/

# 2. Instalar dependências no servidor
ssh user@server
cd /opt/payable-node
npm install --prod

# 3. Iniciar aplicação
node dist/main.js
```

### Deploy com Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --prod

COPY dist/ ./dist/

EXPOSE 8084

CMD ["node", "dist/main.js"]
```

#### Build e execução

```bash
# Build da imagem
docker build -t payable-node .

# Executar container
docker run -p 8084:8084 payable-node
```

### Deploy com PM2

```bash
# Instalar PM2
npm install -g pm2

# Configurar aplicação
pm2 start dist/main.js --name "payable-node"

# Monitorar
pm2 status
pm2 logs payable-node

# Auto-start na reinicialização
pm2 startup
pm2 save
```

## 🔧 Configurações Avançadas

### Configuração de Banco de Dados

#### SQLite com arquivo

Edite `src/app.module.ts`:

```typescript
SequelizeModule.forRoot({
  dialect: 'sqlite',
  storage: './database.sqlite', // Arquivo persistente
  autoLoadModels: true,
  models: [PaymentModel],
})
```

#### PostgreSQL (Produção)

```typescript
SequelizeModule.forRoot({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'payable',
  autoLoadModels: true,
  models: [PaymentModel],
})
```

### Configuração de CORS

Edite `src/main.ts`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://mydomain.com'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
  
  await app.listen(process.env.PORT ?? 8084)
}
```

### Configuração de Logs

```bash
# Instalar winston
pnpm add winston

# Configurar em app.module.ts
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

WinstonModule.forRoot({
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})
```

## 🔐 Configurações de Segurança

### Rate Limiting

```bash
# Instalar throttler
pnpm add @nestjs/throttler

# Configurar em app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10,
})
```

### Helmet para Headers de Segurança

```bash
# Instalar helmet
pnpm add helmet

# Configurar em main.ts
import helmet from 'helmet'
app.use(helmet())
```

## 📊 Monitoramento

### Health Check

```typescript
// src/health/health.controller.ts
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }
}
```

### Métricas

```bash
# Instalar Prometheus
pnpm add @prometheus-io/client

# Configurar métricas básicas
import client from '@prometheus-io/client'

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
})
```

## 🧪 Configuração de Testes

### Configuração do Jest

O Jest já está configurado no `package.json`. Para customizar:

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "setupFilesAfterEnv": ["<rootDir>/test/setup.ts"]
  }
}
```

### Configuração de Mocks

```typescript
// test/setup.ts
import { Test } from '@nestjs/testing'

// Mock global do HTTP service
jest.mock('@nestjs/axios', () => ({
  HttpService: jest.fn().mockImplementation(() => ({
    post: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  })),
}))
```

## 📝 Próximos Passos

Após configuração básica:

1. [ ] Configurar banco de dados persistente
2. [ ] Implementar autenticação
3. [ ] Configurar monitoring
4. [ ] Setup de CI/CD
5. [ ] Configurar backup automático

## 🆘 Suporte

### Documentação

- [README.md](../README.md) - Visão geral do projeto
- [API.md](./API.md) - Documentação da API
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do sistema

### Comandos Úteis

```bash
# Verificar status da aplicação
curl -i http://localhost:8084/payments

# Monitorar logs em tempo real
pnpm run start:dev | grep -i error

# Verificar uso de porta
netstat -tulpn | grep :8084

# Restart rápido
pkill -f "nest start" && pnpm run start:dev
```

---

**Autor**: Fernando Britto  
**Versão**: 1.0.0  
**Última atualização**: Janeiro 2024 