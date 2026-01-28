# 🗄️ Banco de Dados - Estrutura Organizada

Esta pasta contém todos os scripts SQL do sistema organizados por propósito.

## 📂 Estrutura

```
database/
├── main/                    # Schema principal do banco de dados
│   └── database.sql         # Schema completo e atualizado (v2)
│
└── migrations/              # Scripts de migração e features específicas
    ├── database-schema.sql         # Schema versão original/anterior
    └── database-refresh-tokens.sql # Feature de refresh tokens
```

## 📋 Descrição das Pastas

### 🎯 **main/**
Contém o **schema principal e atualizado** do banco de dados.

**Arquivo:**
- `database.sql` - Schema completo da versão 2 do sistema
  - 17 tabelas com relacionamentos
  - Usuários, contas, transações, cartões
  - Investimentos, empréstimos, pagamentos
  - Sistema de notificações e auditoria
  - Triggers e views
  - Dados de exemplo

**Uso:** Este é o arquivo que deve ser executado para criar o banco de dados completo.

### 🔄 **migrations/**
Scripts de migração incremental e features específicas.

**Arquivos:**
- `database-schema.sql` - Schema da versão original/anterior
- `database-refresh-tokens.sql` - Adiciona tabela de refresh tokens JWT

**Uso:** Scripts para migrar de versões anteriores ou adicionar features específicas.

## 🚀 Como Usar

### Instalação Nova (Recomendado)

Para criar o banco de dados do zero:

```sql
-- Execute o schema principal
SOURCE database/main/database.sql;
```

### Migração de Versão Anterior

Se você já tem uma versão anterior instalada:

```sql
-- 1. Faça backup do banco atual
mysqldump -u root -p ibank > backup.sql

-- 2. Execute as migrations necessárias
SOURCE database/migrations/database-refresh-tokens.sql;
```

## 📊 Esquema do Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Dados dos usuários com criptografia |
| `contas` | Contas bancárias (BRL, EUR, USD) |
| `transacoes` | Histórico de transações |
| `cartoes` | Cartões de débito/crédito |
| `investimentos` | CDB, Tesouro, Ações |
| `emprestimos` | Empréstimos e parcelas |
| `pagamentos` | Pagamentos e recorrência |
| `notificacoes` | Sistema de notificações |
| `auditoria` | Log de todas as operações |
| `refresh_tokens` | Tokens JWT para autenticação |

## 🔒 Segurança

O schema inclui:
- ✅ Criptografia AES-256-GCM para dados sensíveis
- ✅ Hash SHA-256 para buscas
- ✅ Índices otimizados
- ✅ Foreign keys e constraints
- ✅ Triggers de auditoria

## 📝 Notas

- **Schema principal:** `database/main/database.sql`
- **Versão:** 2.0
- **Charset:** UTF-8 (utf8mb4)
- **Engine:** InnoDB

## 🔗 Relacionado

- Scripts de manutenção: `_local/database/maintenance/`
- Documentação: `_docs/`

---

**Última atualização:** 28/01/2026  
**Localização:** `c:\laragon\www\java\database\`
