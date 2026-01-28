# 🔄 Guia de Fluxo de Trabalho - Branches DEV e MAIN

## 📖 Visão Geral

Este guia mostra como trabalhar diariamente com as branches `dev` e `main`, mantendo a organização do projeto.

---

## 🎯 Regra de Ouro

```
dev    → Desenvolvimento completo (testes, docs, scripts)
  ↓
main   → Apenas código de produção (limpo e otimizado)
```

**NUNCA** faça merge direto de `dev` → `main` (contém arquivos desnecessários)

---

## 📋 Cenário 1: Desenvolvimento Diário

### Trabalhando na Branch DEV

```powershell
# 1. Certificar que está na branch dev
git checkout dev

# 2. Atualizar com o remoto
git pull origin dev

# 3. Fazer suas alterações
# ... edite arquivos, crie testes, adicione docs ...

# 4. Verificar o que mudou
git status

# 5. Adicionar arquivos
git add .
# OU adicionar arquivos específicos
git add backend/src/main/java/com/ibank/...

# 6. Fazer commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"
# OU
git commit -m "fix: corrige bug na autenticacao"
# OU
git commit -m "docs: atualiza documentacao da API"

# 7. Enviar para o repositório remoto
git push origin dev

# 8. Criar Pull Request (se houver proteção)
# Acesse: https://github.com/Njeskj/java-sistema-bancario/pulls
# Clique em: "New pull request"
# Base: dev ← Compare: sua-branch (se criou uma branch separada)
```

### Tipos de Commit (Conventional Commits)

```
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Apenas documentação
style:    Formatação (sem mudança de código)
refactor: Refatoração de código
test:     Adicionar/modificar testes
chore:    Tarefas de manutenção
perf:     Melhoria de performance
ci:       Mudanças em CI/CD
build:    Mudanças no build/dependências
```

---

## 📋 Cenário 2: Movendo Código para Produção

### Opção A: Cherry-Pick (Recomendado)

Use quando quiser mover **commits específicos** de `dev` para `main`:

```powershell
# 1. Ir para a branch dev e ver os commits recentes
git checkout dev
git log --oneline -10

# Exemplo de saída:
# a1b2c3d feat: adiciona novo endpoint de transferencia
# e4f5g6h fix: corrige validacao de CPF
# i7j8k9l docs: atualiza README

# 2. Copiar o hash do commit desejado (ex: a1b2c3d)

# 3. Ir para a branch main
git checkout main

# 4. Atualizar a branch main
git pull origin main

# 5. Aplicar o commit específico
git cherry-pick a1b2c3d

# 6. Se houver conflitos, resolva-os
# Edite os arquivos em conflito
git add .
git cherry-pick --continue

# 7. Enviar para produção
git push origin main
```

### Opção B: Merge Seletivo de Arquivos

Use quando quiser mover **arquivos específicos**:

```powershell
# 1. Ir para a branch main
git checkout main

# 2. Ver diferenças com a branch dev
git diff dev

# 3. Copiar arquivos específicos da branch dev
git checkout dev -- backend/src/main/java/com/ibank/controller/NovoController.java

# 4. Verificar o que foi copiado
git status

# 5. Fazer commit
git commit -m "feat: adiciona NovoController da branch dev"

# 6. Enviar para produção
git push origin main
```

### Opção C: Merge Completo com Exclusão (NÃO RECOMENDADO)

⚠️ **Evite esta opção!** Use apenas se souber exatamente o que está fazendo:

```powershell
# 1. Criar branch temporária
git checkout -b temp-merge

# 2. Fazer merge da dev
git merge dev

# 3. Remover arquivos desnecessários
git rm -r _config/ _database/ _docs/ _scripts/
git rm test-*.* *.bat.backup

# 4. Fazer commit
git commit -m "merge: sincroniza com dev (apenas producao)"

# 5. Ir para main e fazer merge
git checkout main
git merge temp-merge

# 6. Deletar branch temporária
git branch -d temp-merge

# 7. Enviar
git push origin main
```

---

## 📋 Cenário 3: Sincronizar DEV com MAIN

Quando fizer alterações direto na `main` e quiser trazer para `dev`:

```powershell
# 1. Ir para a branch dev
git checkout dev

# 2. Trazer alterações da main
git merge main

# 3. Resolver conflitos (se houver)
# Edite os arquivos em conflito
git add .
git commit -m "merge: sincroniza dev com main"

# 4. Enviar
git push origin dev
```

---

## 📋 Cenário 4: Criar Feature Branch

Para trabalhar em uma funcionalidade isolada:

```powershell
# 1. Partir da branch dev
git checkout dev
git pull origin dev

# 2. Criar nova branch para a feature
git checkout -b feature/nome-da-funcionalidade

# 3. Trabalhar na feature
# ... fazer alterações ...

# 4. Fazer commits
git add .
git commit -m "feat: implementa parte 1 da funcionalidade"

# 5. Enviar a feature branch
git push origin feature/nome-da-funcionalidade

# 6. Criar Pull Request no GitHub
# Base: dev ← Compare: feature/nome-da-funcionalidade

# 7. Após aprovação, merge e delete
git checkout dev
git merge feature/nome-da-funcionalidade
git branch -d feature/nome-da-funcionalidade
git push origin --delete feature/nome-da-funcionalidade
```

---

## 📋 Cenário 5: Corrigir Bug em Produção (Hotfix)

Quando precisa corrigir urgentemente algo na produção:

```powershell
# 1. Partir da branch main
git checkout main
git pull origin main

# 2. Criar branch de hotfix
git checkout -b hotfix/corrige-bug-critico

# 3. Fazer a correção
# ... corrigir o bug ...

# 4. Fazer commit
git add .
git commit -m "fix: corrige bug critico em producao"

# 5. Testar a correção

# 6. Merge na main
git checkout main
git merge hotfix/corrige-bug-critico
git push origin main

# 7. Também aplicar na dev
git checkout dev
git merge hotfix/corrige-bug-critico
git push origin dev

# 8. Deletar branch de hotfix
git branch -d hotfix/corrige-bug-critico
```

---

## 📋 Cenário 6: Ver Diferenças Entre Branches

```powershell
# Ver quais arquivos diferem entre dev e main
git diff --name-only dev main

# Ver diferenças em um arquivo específico
git diff dev main -- backend/pom.xml

# Ver commits que estão na dev mas não na main
git log main..dev --oneline

# Ver commits que estão na main mas não na dev
git log dev..main --oneline

# Ver estatísticas de diferenças
git diff --stat dev main
```

---

## 📋 Cenário 7: Desfazer Alterações

### Desfazer mudanças não commitadas

```powershell
# Descartar mudanças em um arquivo específico
git checkout -- arquivo.txt

# Descartar todas as mudanças
git checkout .

# Remover arquivos não rastreados
git clean -fd
```

### Desfazer último commit (antes do push)

```powershell
# Desfazer commit mas manter alterações
git reset HEAD~1

# Desfazer commit e descartar alterações
git reset --hard HEAD~1
```

### Desfazer commit já enviado (após push)

```powershell
# Criar commit que reverte o anterior
git revert HEAD
git push origin dev

# OU especificar o hash do commit
git revert a1b2c3d
git push origin dev
```

---

## 🎯 Comandos Úteis Diários

```powershell
# Ver status atual
git status

# Ver histórico de commits
git log --oneline -10
git log --graph --oneline --all

# Ver branches locais e remotas
git branch -a

# Ver qual branch está ativa
git branch --show-current

# Atualizar todas as referências remotas
git fetch --all

# Ver diferenças antes de commitar
git diff

# Ver diferenças já staged
git diff --staged

# Ver quem modificou cada linha de um arquivo
git blame arquivo.txt

# Buscar commits por mensagem
git log --grep="palavra-chave"

# Buscar commits por autor
git log --author="seu-nome"
```

---

## 📊 Fluxo Recomendado (GitFlow Simplificado)

```
┌─────────────────────────────────────────┐
│  Desenvolvimento Diário                 │
│  ↓                                      │
│  dev (branch principal de dev)          │
│  ├── feature/nova-funcionalidade        │
│  ├── feature/outra-funcionalidade       │
│  └── test/testes-integracao            │
└─────────────────────────────────────────┘
            │
            │ cherry-pick ou merge seletivo
            ↓
┌─────────────────────────────────────────┐
│  Produção                               │
│  ↓                                      │
│  main (apenas código de produção)       │
└─────────────────────────────────────────┘
            ↑
            │ hotfix (urgente)
            │
┌─────────────────────────────────────────┐
│  hotfix/corrige-bug-critico             │
└─────────────────────────────────────────┘
```

---

## ⚠️ Boas Práticas

✅ **FAÇA:**
- Commits pequenos e frequentes
- Mensagens de commit descritivas
- Pull antes de push
- Trabalhe em feature branches para funcionalidades grandes
- Teste antes de fazer push para main
- Use cherry-pick para mover código para produção

❌ **NÃO FAÇA:**
- Commits gigantes com muitas mudanças
- Mensagens genéricas ("fix", "update", "changes")
- Push direto na main sem testar
- Merge completo de dev → main (contém arquivos de teste)
- Force push sem necessidade (`git push --force`)
- Commitar arquivos sensíveis (senhas, tokens, etc)

---

## 🔗 Recursos Adicionais

- [CHECKLIST-CONFIGURACAO.md](CHECKLIST-CONFIGURACAO.md) - Configurar privacidade
- [README-DEV.md](README-DEV.md) - Sobre a branch dev
- [CONFIGURACAO-PRIVACIDADE.md](CONFIGURACAO-PRIVACIDADE.md) - Guia de segurança

---

**Data:** 28/01/2026  
**Versão:** 1.0
