# Guia de Troubleshooting - Payable Node

Este guia fornece soluções para problemas comuns encontrados durante o desenvolvimento, configuração e execução do Sistema de Pagamentos Payable Node.

## 🚨 Problemas de Instalação

### 1. Erro ao instalar dependências

#### Problema: `pnpm install` falha

**Sintomas:**
```bash
ERR_PNPM_NO_MATCHING_VERSION
```

**Soluções:**
```bash
# 1. Limpar cache do pnpm
pnpm cache clean

# 2. Deletar node_modules e lock file
rm -rf node_modules pnpm-lock.yaml

# 3. Reinstalar
pnpm install

# 4. Se persistir, usar npm
npm install
```

#### Problema: Versão do Node.js incompatível

**Sintomas:**
```bash
error @nestjs/core@10.0.0: The engine "node" is incompatible
```

**Soluções:**
```bash
# Verificar versão atual
node --version

# Instalar versão compatível (18+)
# Com nvm:
nvm install 18
nvm use 18

# Com fnm:
fnm install 18
fnm use 18
```

### 2. Problemas de Permissão (Linux/macOS)

#### Problema: Permission denied

**Sintomas:**
```bash
EACCES: permission denied, open '/usr/local/lib/node_modules'
```

**Soluções:**
```bash
# 1. Configurar npm para usar diretório local
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# 2. Ou alterar proprietário (cuidado!)
sudo chown -R $(whoami) /usr/local/lib/node_modules

# 3. Usar gerenciador de versão (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## 🚀 Problemas de Execução

### 1. Porta em uso

#### Problema: Address already in use

**Sintomas:**
```bash
Error: listen EADDRINUSE: address already in use :::8084
```

**Soluções:**
```bash
# 1. Encontrar processo usando a porta
lsof -ti:8084
# ou
netstat -tulpn | grep :8084

# 2. Matar processo
kill -9 <PID>

# 3. Usar porta diferente
PORT=3000 pnpm run start:dev

# 4. Matar todos os processos Node.js
pkill -f node
```

### 2. API Mock não disponível

#### Problema: Bank API connection refused

**Sintomas:**
```bash
connect ECONNREFUSED 127.0.0.1:3001
```

**Soluções:**
```bash
# 1. Verificar se mock está rodando
curl http://localhost:3001/payments

# 2. Iniciar API mock
pnpm run bank-api

# 3. Verificar porta no código
# src/payments/payments.module.ts
HttpModule.register({
  baseURL: 'http://localhost:3001',
})

# 4. Testar com netcat
nc -zv localhost 3001
```

### 3. Problemas de Banco de Dados

#### Problema: Table doesn't exist

**Sintomas:**
```bash
SQLITE_ERROR: no such table: PaymentModels
```

**Soluções:**
```bash
# 1. Verificar configuração autoLoadModels
# app.module.ts deve ter:
autoLoadModels: true,

# 2. Reiniciar aplicação
pnpm run start:dev

# 3. Verificar se entity está importada
# app.module.ts
models: [PaymentModel],
```

## 🔧 Problemas de Desenvolvimento

### 1. Hot Reload não funciona

#### Problema: Mudanças não são detectadas

**Soluções:**
```bash
# 1. Verificar se está usando start:dev
pnpm run start:dev

# 2. Limpar cache TypeScript
rm -rf dist/

# 3. Verificar arquivos .gitignore
# Certificar que src/ não está ignorado

# 4. Usar polling (WSL/Docker)
npm i -D @nestjs/cli
nest start --watch --watchAssets
```

### 2. TypeScript Errors

#### Problema: Type errors durante compilação

**Sintomas:**
```bash
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'
```

**Soluções:**
```bash
# 1. Verificar tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": false,
    "noImplicitAny": false
  }
}

# 2. Limpar build
rm -rf dist/
pnpm run build

# 3. Reiniciar TypeScript server (VS Code)
Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

### 3. Import/Export Errors

#### Problema: Cannot find module

**Sintomas:**
```bash
Module '"@nestjs/common"' has no exported member 'Injectable'
```

**Soluções:**
```bash
# 1. Verificar instalação de dependências
pnpm install @nestjs/common

# 2. Verificar versões compatíveis
pnpm list @nestjs/common

# 3. Limpar cache
rm -rf node_modules package-lock.json
pnpm install

# 4. Verificar import paths
import { Injectable } from '@nestjs/common'
```

## 🧪 Problemas de Testes

### 1. Testes unitários falhando

#### Problema: Nest can't resolve dependencies

**Sintomas:**
```bash
Nest can't resolve dependencies of the PaymentsService (?, HttpService)
```

**Soluções:**
```typescript
// payments.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { HttpService } from '@nestjs/axios'
import { PaymentModel } from './entities/payment.entity'

const mockPaymentModel = {
  create: jest.fn(),
  findAll: jest.fn(),
}

const mockHttpService = {
  post: jest.fn(),
}

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PaymentsService,
      {
        provide: getModelToken(PaymentModel),
        useValue: mockPaymentModel,
      },
      {
        provide: HttpService,
        useValue: mockHttpService,
      },
    ],
  }).compile()
})
```

### 2. Testes E2E falhando

#### Problema: Test timeout

**Sintomas:**
```bash
Timeout - Async callback was not invoked within the 5000ms timeout
```

**Soluções:**
```typescript
// test/app.e2e-spec.ts
describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  }, 10000) // Aumentar timeout

  afterEach(async () => {
    await app.close() // Importante: fechar app
  })
})
```

## 🌐 Problemas de Integração

### 1. CORS Errors

#### Problema: Cross-origin requests blocked

**Sintomas:**
```bash
Access to XMLHttpRequest blocked by CORS policy
```

**Soluções:**
```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
  
  await app.listen(8084)
}
```

### 2. JSON Parsing Errors

#### Problema: Unexpected token in JSON

**Sintomas:**
```bash
SyntaxError: Unexpected token < in JSON at position 0
```

**Soluções:**
```bash
# 1. Verificar Content-Type header
curl -H "Content-Type: application/json" \
     -d '{"amount": 100}' \
     http://localhost:8084/payments

# 2. Verificar response do servidor
curl -i http://localhost:8084/payments

# 3. Middleware para parse JSON
app.use(express.json())
```

## 🔍 Debugging e Diagnóstico

### 1. Habilitar Logs Detalhados

```bash
# Logs da aplicação
DEBUG=* pnpm run start:dev

# Logs do NestJS
pnpm run start:debug

# Logs específicos do módulo
DEBUG=payments:* pnpm run start:dev
```

### 2. Monitoramento de Performance

```typescript
// Middleware para tempo de resposta
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} - ${duration}ms`)
  })
  next()
})
```

### 3. Verificação de Saúde

```bash
# Health check básico
curl -i http://localhost:8084/payments

# Verificar memória
node -e "console.log(process.memoryUsage())"

# Verificar CPU
top -p $(pgrep -f "nest start")
```

## 🐛 Logs de Erro Comuns

### 1. Module Resolution Errors

```bash
# Erro comum
Cannot resolve module 'path/to/module'

# Verificar:
1. Arquivo existe?
2. Extensão correta (.ts, .js)?
3. Export correto?
4. Import path correto?
```

### 2. Circular Dependency

```bash
# Erro: Circular dependency detected
# Solução: Refatorar imports ou usar forwardRef()

@Injectable()
export class ServiceA {
  constructor(
    @Inject(forwardRef(() => ServiceB))
    private serviceB: ServiceB
  ) {}
}
```

### 3. Memory Leaks

```bash
# Sintomas: Aplicação lenta, uso crescente de RAM
# Debug:
node --inspect pnpm run start:dev

# No Chrome: chrome://inspect
# Usar Memory tab para identificar leaks
```

## 🔧 Ferramentas de Debug

### 1. Visual Studio Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "args": ["${workspaceFolder}/src/main.ts"],
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
      "sourceMaps": true,
      "envFile": "${workspaceFolder}/.env",
      "protocol": "inspector",
      "console": "integratedTerminal"
    }
  ]
}
```

### 2. Node.js Inspector

```bash
# Iniciar com inspector
node --inspect-brk dist/main.js

# No Chrome, acessar:
chrome://inspect
```

### 3. Postman/Insomnia

```json
// Collection para testes
{
  "name": "Payable Node API",
  "requests": [
    {
      "name": "Create Payment",
      "method": "POST",
      "url": "http://localhost:8084/payments",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "amount": 100.50,
        "currency": "BRL",
        "status": "pending"
      }
    }
  ]
}
```

## 📊 Monitoramento e Alertas

### 1. Métricas Importantes

```bash
# CPU Usage
top -p $(pgrep -f node)

# Memory Usage
ps aux | grep node

# Disk Usage
df -h

# Network
netstat -tulpn | grep :8084
```

### 2. Logs Estruturados

```typescript
// Logger customizado
import { Logger } from '@nestjs/common'

const logger = new Logger('PaymentsService')

// Usage
logger.log('Payment created', { paymentId: 123 })
logger.error('Payment failed', { error: 'Invalid data' })
logger.warn('Slow query detected', { duration: 2000 })
```

## 🆘 Quando Pedir Ajuda

### Informações para Incluir

1. **Versões:**
   ```bash
   node --version
   pnpm --version
   cat package.json | grep version
   ```

2. **Sistema Operacional:**
   ```bash
   uname -a
   cat /etc/os-release
   ```

3. **Logs de Erro:**
   ```bash
   # Copiar logs completos
   pnpm run start:dev 2>&1 | tee error.log
   ```

4. **Configuração:**
   ```bash
   # Mascarar dados sensíveis
   cat src/app.module.ts
   cat package.json
   ```

### Checklist Antes de Reportar Bug

- [ ] Tentei limpar cache e reinstalar dependências?
- [ ] Verifiquei se todas as portas estão disponíveis?
- [ ] Li os logs de erro completamente?
- [ ] Testei em ambiente limpo?
- [ ] Verifiquei se é problema conhecido nesta documentação?

## 📚 Recursos Adicionais

- [NestJS Documentation](https://docs.nestjs.com/)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## 🔄 Recovery Procedures

### 1. Reset Completo

```bash
# Parar todos os processos
pkill -f "nest start"
pkill -f "json-server"

# Limpar completamente
rm -rf node_modules/
rm -rf dist/
rm pnpm-lock.yaml

# Reinstalar e reiniciar
pnpm install
pnpm run start:dev
```

### 2. Backup e Restore

```bash
# Backup configuração
cp -r src/ backup-src-$(date +%Y%m%d)/
cp package.json backup-package.json

# Restore em caso de problema
cp -r backup-src-20240115/ src/
cp backup-package.json package.json
```

---

**Autor**: Fernando Britto  
**Versão**: 1.0.0  
**Última atualização**: Janeiro 2024

---

## 📞 Contato para Suporte

Para problemas não cobertos neste guia:
- Consulte as outras documentações na pasta `docs/`
- Abra uma issue no repositório
- Consulte a comunidade NestJS 