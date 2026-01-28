# 📁 Arquivos e Pastas Locais (Não versionados)

Este arquivo documenta os arquivos e pastas que existem apenas no ambiente de desenvolvimento local e **não devem ser enviados** para o repositório remoto.

## 🚫 Arquivos Excluídos do Git (.gitignore)

### 1. **Arquivos de Teste**
- `test-*.js` - Scripts de teste do Playwright
- `test-*.bat` - Scripts batch para executar testes
- `test-*.json` - Relatórios de testes
- `test-*.png` - Screenshots de testes
- `load-test.js` - Testes de carga

### 2. **Scripts de Desenvolvimento Local**
- `recompilar-backend.bat` - Script para recompilar o backend
- `*.bat.backup` - Backups de scripts batch
- `iniciar-sistema.bat` - Script local de inicialização (commitado para referência)

### 3. **Scripts SQL Temporários**
Estes scripts são para manutenção pontual e não devem estar na branch principal:
- `add-columns.sql`
- `fix-password.sql`
- `update-admin-password.sql`
- `update-usuarios-table.sql`
- `database-indexes.sql`
- `database-indexes-v2.sql`
- `restore-database.sql`
- `sync-database-schema.sql`

### 4. **Arquivos Compilados**
- `target/` - Arquivos compilados do Maven
- `*.class` - Bytecode Java
- `*.jar`, `*.war`, `*.ear` - Archives Java

### 5. **Logs**
- `*.log`
- `backend-log.txt`
- `backend-debug.txt`
- `logs/`

### 6. **Dependências**
- `node_modules/` - Dependências Node.js
- `mysql-connector-j-*.jar`

### 7. **Configurações de IDE**
- `.idea/` - IntelliJ IDEA
- `.vscode/` - Visual Studio Code
- `*.iml`
- `.project`, `.classpath`, `.settings/`

## 📂 Pastas de Desenvolvimento Local

### `_config/`
Configurações alternativas para desenvolvimento local (Apache, Docker, etc)

### `_database/`
Scripts SQL adicionais para desenvolvimento e testes

### `_docs/`
Documentação de desenvolvimento, guias de instalação e melhorias

### `_scripts/`
Scripts auxiliares para backup, inicialização, etc

## ✅ O que DEVE estar no Git

### Estrutura Principal:
- `backend/` - Código-fonte do backend Spring Boot
- `frontend-web/` - Código-fonte do frontend web React
- `frontend-mobile/` - Código-fonte do app mobile React Native
- `scripts/` - Scripts essenciais (backup, deploy)
- `docker-compose.yml` - Configuração Docker para produção
- `pom.xml` - Configuração Maven do projeto raiz
- `package.json` - Configuração npm do projeto raiz

### Scripts SQL Essenciais:
- `database-schema.sql` - Schema principal do banco
- `database-v2.sql` - Versão atualizada do schema
- `database-refresh-tokens.sql` - Schema de refresh tokens

### Documentação:
- `README-V2.md` - Documentação principal do projeto
- `MELHORIAS-IMPLEMENTADAS.md` - Histórico de melhorias
- `.gitignore` - Configuração de arquivos ignorados

## 🔄 Sincronização

Os arquivos listados acima como "Não versionados" existem apenas no seu ambiente local e não serão sincronizados com o repositório remoto. Isto mantém o repositório limpo e focado apenas nos arquivos necessários para produção.

## 📝 Notas

- Sempre verifique o `.gitignore` antes de fazer commit
- Use `git status` para verificar quais arquivos serão commitados
- Scripts de teste e desenvolvimento devem ficar apenas no ambiente local
- Documente novos arquivos locais neste documento
