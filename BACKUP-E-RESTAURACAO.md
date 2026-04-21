# Backup e Restauração — KitsDigitalia

## Checkpoint estável atual

| Item | Valor |
|------|-------|
| **Commit** | `0d6bcb188c1f90141f034ac8d2a6e951aaff9586` |
| **Tag** | `backup-estavel-login-google` |
| **Branch de backup** | `backup/estavel-login-google` |
| **Branch principal** | `main` |
| **Data** | 22/04/2026 |

### O que está estável neste checkpoint

- Login com Google OAuth funcionando (`signInWithOAuth`)
- Login com email/senha funcionando (`signInWithPassword`)
- Cadastro com confirmação por email funcionando (`signUp`)
- Catálogo frontend/backend sincronizado (25 produtos, preços alinhados)
- Build do painel (`painel/`) sem dependência de fonte remota em build-time
- `.gitignore` protegendo `node_modules`, `.next`, `.env`, worktrees
- Assets com fallback visual (onerror → emoji)

---

## Comandos de restauração

### Ver o estado exato do checkpoint

```bash
git show backup-estavel-login-google
git diff backup-estavel-login-google HEAD
```

### Criar uma branch nova a partir do backup (para testar/desenvolver com segurança)

```bash
git checkout -b minha-feature backup-estavel-login-google
```

### Restaurar a branch main para o checkpoint (se algo quebrar seriamente)

```bash
# ATENÇÃO: descarta commits feitos APÓS o checkpoint
git checkout main
git reset --hard backup-estavel-login-google
git push origin main --force-with-lease
```

### Comparar estado atual com o backup

```bash
git diff backup-estavel-login-google
git diff backup-estavel-login-google --name-only
git log backup-estavel-login-google..HEAD --oneline
```

### Voltar temporariamente ao estado do backup (modo detached, somente leitura)

```bash
git checkout backup-estavel-login-google
# Para voltar ao main:
git checkout main
```

---

## Protocolo de operação segura

### Antes de qualquer mudança grande

1. Confirmar que o working tree está limpo: `git status`
2. Criar um checkpoint novo:
   ```bash
   git tag -a "checkpoint-YYYY-MM-DD-descricao" -m "Checkpoint antes de: [descrever mudança]"
   git push origin "checkpoint-YYYY-MM-DD-descricao"
   ```
3. Só então começar a mudança

### Regras permanentes

| Regra | Detalhe |
|-------|---------|
| **Não empilhar sobre código quebrado** | Se um bug grave surgir, reverter ao último checkpoint antes de continuar |
| **Não trabalhar em worktrees antigos** | `.claude/worktrees/` são descartáveis — o projeto oficial é sempre a raiz |
| **Não refatorar fora do escopo** | Mudanças estéticas/estruturais só com pedido explícito |
| **Validar cada etapa** | Testar no browser antes de criar novo checkpoint |
| **Um checkpoint por feature** | Criar tag antes de começar cada mudança significativa |

### Arquivos críticos — não alterar sem necessidade

| Arquivo | O que faz |
|---------|-----------|
| `login.html` | Auth Supabase (Google OAuth + email/senha) |
| `api/_catalog.js` | Fonte de verdade de preços e produtos no backend |
| `api/create-pix-order.js` | Fluxo de pagamento PIX |
| `painel/app/layout.tsx` | Layout do painel admin |
| `scripts/main.js` | Catálogo e lógica frontend |
| `vercel.json` | Configuração de rotas e funções serverless |

---

## Histórico de checkpoints

| Data | Tag / Commit | Descrição |
|------|-------------|-----------|
| 22/04/2026 | `backup-estavel-login-google` @ `0d6bcb1` | Login Google funcionando, catálogo sincronizado, build estável |
