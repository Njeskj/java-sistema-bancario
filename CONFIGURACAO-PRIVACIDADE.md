# 🔒 Guia de Configuração de Privacidade e Proteção da Branch DEV

## 📋 Índice
1. [Privacidade do Repositório](#privacidade-do-repositório)
2. [Proteção da Branch DEV](#proteção-da-branch-dev)
3. [Gerenciamento de Colaboradores](#gerenciamento-de-colaboradores)
4. [Verificação de Configurações](#verificação-de-configurações)

---

## 🔐 Privacidade do Repositório

### ⚠️ Importante Entender

No GitHub, a **privacidade é controlada no nível do repositório**, não por branch individual:

- ✅ **Repositório Privado** → Todas as branches são privadas
- ❌ **Repositório Público** → Todas as branches são públicas

**Não existe "branch privada" em um repositório público!**

### Verificar se o Repositório é Privado

1. Acesse: https://github.com/Njeskj/java-sistema-bancario
2. Verifique se há um ícone **🔒 Private** próximo ao nome do repositório

### Tornar o Repositório Privado (se necessário)

Se o repositório estiver público e você quiser torná-lo privado:

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings
2. **Role até o final da página** → Seção "Danger Zone"
3. **Clique em:** "Change repository visibility"
4. **Selecione:** "Make private"
5. **Confirme:** Digite o nome do repositório e confirme

⚠️ **Atenção:** Esta ação tornará **TODO o repositório** e **TODAS as branches** privadas.

---

## 🛡️ Proteção da Branch DEV

Mesmo em um repositório privado, você pode adicionar regras de proteção para evitar pushes acidentais ou não autorizados na branch `dev`.

### Passo 1: Acessar Configurações de Branches

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings/branches
2. **Clique em:** "Add branch protection rule"

### Passo 2: Configurar Proteção para Branch DEV

**Branch name pattern:** `dev`

#### ✅ Configurações Recomendadas:

**Proteção contra pushes diretos:**
- ☑️ **Require a pull request before merging**
  - ☑️ Require approvals: `1`
  - ☑️ Dismiss stale pull request approvals when new commits are pushed
  - ☑️ Require review from Code Owners

**Proteção de histórico:**
- ☑️ **Require linear history** (evita merge commits desnecessários)
- ☑️ **Include administrators** (aplicar regras até para admins)

**Restrição de acesso:**
- ☑️ **Restrict who can push to matching branches**
  - Adicione apenas usuários/equipes autorizados

**Verificações antes do merge:**
- ☑️ **Require status checks to pass before merging**
  - Adicione checks de CI/CD se configurados

**Proteção contra força bruta:**
- ☑️ **Do not allow bypassing the above settings**
- ☑️ **Do not allow deletions** (impede deletar a branch)

### Passo 3: Salvar Configurações

- **Clique em:** "Create" ou "Save changes"

---

## 👥 Gerenciamento de Colaboradores

Para controlar **quem pode acessar** o repositório privado:

### Adicionar Colaboradores

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings/access
2. **Clique em:** "Add people" ou "Invite a collaborator"
3. **Digite:** Username ou email do GitHub do colaborador
4. **Selecione o nível de permissão:**

#### Níveis de Permissão:

| Permissão | Descrição | Acesso à Branch DEV |
|-----------|-----------|---------------------|
| **Read** | Apenas visualizar código e issues | ✅ Ver código |
| **Triage** | Gerenciar issues e pull requests | ✅ Ver código |
| **Write** | Push, pull requests e algumas configurações | ✅ Push/Pull |
| **Maintain** | Gerenciar repositório sem acesso sensível | ✅ Total |
| **Admin** | Acesso total incluindo configurações | ✅ Total |

### Remover Colaboradores

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings/access
2. **Encontre o colaborador** na lista
3. **Clique em:** "Remove" ao lado do nome

---

## 🔍 Verificação de Configurações

### Verificar Privacidade do Repositório

```bash
# Comando local Git (não mostra privacidade)
git remote -v

# Acesse o GitHub e verifique o ícone 🔒 Private
```

### Verificar Branches Protegidas

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings/branches
2. Verifique se `dev` aparece na lista de "Branch protection rules"

### Verificar Colaboradores

1. **Acesse:** https://github.com/Njeskj/java-sistema-bancario/settings/access
2. Veja a lista de pessoas com acesso

### Testar Proteção

```bash
# Tente fazer push direto na branch dev (deve ser bloqueado se configurado)
git checkout dev
echo "test" >> test-protection.txt
git add test-protection.txt
git commit -m "test: verificando protecao"
git push origin dev
# Se configurado corretamente, vai exigir PR
```

---

## 📊 Resumo das Configurações

### ✅ Checklist de Segurança

- [ ] Repositório está **privado**
- [ ] Branch `dev` tem **proteção configurada**
- [ ] Apenas **você** tem acesso Admin
- [ ] Colaboradores têm **permissões apropriadas**
- [ ] **Pull Requests** são obrigatórios para branch `dev`
- [ ] Branch `main` também está **protegida** (recomendado)

---

## 🔗 Links Diretos

- **Configurações do Repositório:** https://github.com/Njeskj/java-sistema-bancario/settings
- **Proteção de Branches:** https://github.com/Njeskj/java-sistema-bancario/settings/branches
- **Gerenciar Acesso:** https://github.com/Njeskj/java-sistema-bancario/settings/access
- **Danger Zone (Privacidade):** Role até o final em Settings

---

## ⚠️ Avisos Importantes

1. **Repositório privado ≠ Branch privada individual**
   - Não existe branch privada em repo público
   - Todas as branches herdam a privacidade do repositório

2. **Proteção de branch ≠ Privacidade**
   - Proteção controla **como** se faz push
   - Privacidade controla **quem** pode ver

3. **Acesso de colaboradores**
   - Mesmo em repo privado, colaboradores com acesso "Read" podem ver **todas** as branches
   - Use permissões apropriadas para cada colaborador

4. **GitHub Free vs Pro**
   - GitHub Free: Repositórios privados com colaboradores ilimitados
   - GitHub Pro: Recursos adicionais de proteção

---

## 📞 Suporte

Se tiver dúvidas sobre privacidade e acesso:
- **GitHub Docs:** https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features
- **GitHub Support:** https://support.github.com/

---

**Data de criação:** 28/01/2026  
**Última atualização:** 28/01/2026
