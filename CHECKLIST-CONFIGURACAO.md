# ✅ Checklist de Configuração - Repositório Privado

Execute este checklist passo a passo para configurar a privacidade e proteção do seu repositório.

---

## 📋 PASSO 1: Verificar Privacidade do Repositório

### ✅ Ação: Verificar se o repositório está privado

1. **Abra o navegador** e acesse:
   ```
   https://github.com/Njeskj/java-sistema-bancario
   ```

2. **Procure o ícone** próximo ao nome do repositório:
   - ✅ Se aparecer **🔒 Private** → Repositório está privado
   - ❌ Se aparecer **📖 Public** → Repositório está público

### 🔄 Se o repositório estiver PÚBLICO, torne-o PRIVADO:

1. **Acesse as configurações:**
   ```
   https://github.com/Njeskj/java-sistema-bancario/settings
   ```

2. **Role até o final da página** → Seção "Danger Zone"

3. **Clique em:** "Change visibility" ou "Change repository visibility"

4. **Selecione:** "Make private"

5. **Confirme:** 
   - Digite: `Njeskj/java-sistema-bancario`
   - Clique em "I understand, change repository visibility"

✅ **Resultado:** Agora TODAS as branches (main e dev) são privadas!

---

## 📋 PASSO 2: Proteger a Branch DEV

### ✅ Ação: Adicionar regras de proteção na branch dev

1. **Acesse configurações de branches:**
   ```
   https://github.com/Njeskj/java-sistema-bancario/settings/branches
   ```

2. **Clique em:** "Add branch protection rule" ou "Add rule"

3. **Configure:**

   **Branch name pattern:**
   ```
   dev
   ```

   **Marque as seguintes opções:**

   #### Proteção básica:
   - ☑️ **Require a pull request before merging**
     - Require approvals: `1`
   
   - ☑️ **Require status checks to pass before merging**
   
   - ☑️ **Require linear history**
   
   - ☑️ **Do not allow bypassing the above settings**
   
   - ☑️ **Do not allow deletions** (impede deletar a branch)

   #### Proteção avançada (opcional):
   - ☑️ **Include administrators** (aplicar regras até para admins)
   
   - ☑️ **Restrict who can push to matching branches**
     - Adicione apenas você mesmo

4. **Clique em:** "Create" ou "Save changes"

✅ **Resultado:** A branch dev está protegida contra pushes diretos!

---

## 📋 PASSO 3: Proteger a Branch MAIN

### ✅ Ação: Adicionar regras de proteção na branch main

Repita o PASSO 2, mas agora para a branch **main**:

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings/branches

2. **Clique em:** "Add branch protection rule"

3. **Branch name pattern:**
   ```
   main
   ```

4. **Marque as mesmas opções do PASSO 2**

5. **Clique em:** "Create"

✅ **Resultado:** A branch main também está protegida!

---

## 📋 PASSO 4: Configurar Branch Padrão

### ✅ Ação: Definir qual branch aparece por padrão

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings/branches

2. **Na seção "Default branch"**, verifique qual branch está definida

3. **Recomendação:**
   - Para produção: Deixe **main** como padrão
   - Para desenvolvimento: Pode mudar para **dev**

4. Se quiser mudar, **clique no ícone de troca** ⇄ e selecione a branch desejada

✅ **Resultado:** Branch padrão configurada!

---

## 📋 PASSO 5: Gerenciar Colaboradores (Opcional)

### ✅ Ação: Adicionar ou remover acesso de pessoas

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings/access

2. **Para ADICIONAR colaborador:**
   - Clique em: "Add people"
   - Digite: username ou email do GitHub
   - Selecione permissão:
     - **Read** → Apenas ver o código
     - **Write** → Push e criar pull requests
     - **Admin** → Acesso total
   - Clique em: "Add [nome] to this repository"

3. **Para REMOVER colaborador:**
   - Encontre o nome na lista
   - Clique em: "Remove"

✅ **Resultado:** Acesso controlado!

---

## 📋 PASSO 6: Testar Configurações

### ✅ Ação: Verificar se as proteções estão funcionando

Execute no terminal:

```powershell
# Ir para a branch dev
git checkout dev

# Criar um arquivo de teste
echo "test" > test-protection.txt

# Tentar fazer push direto (DEVE SER BLOQUEADO se configurado corretamente)
git add test-protection.txt
git commit -m "test: verificando protecao da branch"
git push origin dev
```

**Resultado esperado:**
- ❌ Push bloqueado → Configuração funcionando! ✅
- ✅ Push aceito → Revise as configurações de proteção

**Limpeza após teste:**
```powershell
git reset HEAD~1
rm test-protection.txt
```

---

## 📋 PASSO 7: Verificar Branches Remotas

### ✅ Ação: Confirmar que ambas as branches existem no GitHub

Execute no terminal:

```powershell
git fetch --all
git branch -r
```

**Resultado esperado:**
```
origin/HEAD -> origin/main
origin/dev
origin/main
```

✅ **Confirmado:** Ambas as branches estão no repositório remoto!

---

## 🎯 RESUMO DO CHECKLIST

Marque conforme for completando:

- [ ] ✅ Repositório está PRIVADO
- [ ] ✅ Branch `dev` está PROTEGIDA
- [ ] ✅ Branch `main` está PROTEGIDA
- [ ] ✅ Branch padrão configurada
- [ ] ✅ Colaboradores gerenciados (se necessário)
- [ ] ✅ Proteções testadas e funcionando
- [ ] ✅ Branches remotas verificadas

---

## 🔗 Links Rápidos

- **Repositório:** https://github.com/Njeskj/java-sistema-bancario
- **Settings:** https://github.com/Njeskj/java-sistema-bancario/settings
- **Branches:** https://github.com/Njeskj/java-sistema-bancario/settings/branches
- **Access:** https://github.com/Njeskj/java-sistema-bancario/settings/access
- **Branch DEV:** https://github.com/Njeskj/java-sistema-bancario/tree/dev
- **Branch MAIN:** https://github.com/Njeskj/java-sistema-bancario/tree/main

---

## 📞 Ajuda

Se tiver dúvidas, consulte:
- [CONFIGURACAO-PRIVACIDADE.md](CONFIGURACAO-PRIVACIDADE.md) - Guia detalhado
- [README-DEV.md](README-DEV.md) - Sobre a branch dev
- GitHub Docs: https://docs.github.com

---

**Data:** 28/01/2026  
**Status:** Aguardando configuração manual no GitHub
