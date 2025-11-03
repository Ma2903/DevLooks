# 🔐 Guia: Token JWT Expirado

## ⚠️ O que é esse erro?

O erro `TokenExpiredError: jwt expired` **NÃO é um bug**, mas sim uma medida de segurança. 

Tokens JWT (JSON Web Tokens) têm um tempo de vida limitado para proteger sua aplicação. Quando um token expira, o usuário precisa fazer login novamente.

---

## ✅ Correções Aplicadas

### 1. **Backend - Melhor Tratamento de Erro**

**Arquivo:** `server/middlewares/authMiddleware.ts`

**Mudanças:**
- ✅ Diferenciação entre token expirado e token inválido
- ✅ Mensagens de erro mais claras
- ✅ Logs menos verbosos (apenas warnings para tokens expirados)

**Resposta da API agora inclui:**
```json
{
  "message": "Sua sessão expirou. Por favor, faça login novamente.",
  "expired": true
}
```

### 2. **Frontend - Interceptor de Resposta**

**Arquivo:** `view/services/main.js`

**Funcionalidades:**
- ✅ Detecta automaticamente quando o token expira (erro 401)
- ✅ Limpa o localStorage automaticamente
- ✅ Redireciona para a página de login
- ✅ Dispara evento para atualizar o estado da aplicação

### 3. **Frontend - Notificação Amigável**

**Arquivo:** `view/App.vue`

**Funcionalidades:**
- ✅ Listener de evento que detecta mudanças de autenticação
- ✅ Mostra uma notificação SweetAlert2 amigável quando a sessão expira
- ✅ Atualiza o estado do usuário no componente

---

## 🧪 Como Testar

### Cenário 1: Token Expira Durante Uso

1. Faça login no sistema
2. Aguarde o tempo de expiração do token (ou force a expiração modificando a data no JWT_SECRET)
3. Tente fazer uma ação que requer autenticação (ex: adicionar ao carrinho)
4. **Resultado Esperado:**
   - Notificação aparece: "Sua sessão expirou"
   - Usuário é redirecionado para `/login`
   - localStorage é limpo automaticamente

### Cenário 2: Novo Login

1. Após o token expirar, faça login novamente
2. Um novo token será gerado
3. Tudo funcionará normalmente

---

## 🔧 Ajustando o Tempo de Expiração

Se você quiser que o token dure mais tempo, edite o arquivo onde o token é gerado:

**Arquivo:** `server/controllers/UserController.ts` (ou onde você gera o token)

**Encontre esta linha:**
```typescript
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
```

**Opções comuns:**
- `'1h'` - 1 hora (padrão)
- `'24h'` - 24 horas (1 dia)
- `'7d'` - 7 dias
- `'30d'` - 30 dias

**Exemplo para 7 dias:**
```typescript
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
```

⚠️ **Importante:** Tokens de longa duração são menos seguros. Para produção, recomenda-se:
- Token de acesso: 15min - 1h
- Refresh token: 7-30 dias (implementação mais avançada)

---

## 📝 Próximos Passos (Opcional - Avançado)

Para uma solução profissional, considere implementar:

### Refresh Tokens

1. **Token de Acesso (curto):** 15 minutos
2. **Refresh Token (longo):** 7 dias
3. Quando o access token expira, use o refresh token para obter um novo sem fazer login

**Fluxo:**
```
Login → Access Token (15min) + Refresh Token (7d)
↓
Access Token expira
↓
Usa Refresh Token para gerar novo Access Token
↓
Continua usando a aplicação sem interrupção
```

---

## ✅ Status Atual

Com as correções aplicadas, o sistema agora:

- ✅ Trata tokens expirados de forma elegante
- ✅ Mostra notificações amigáveis ao usuário
- ✅ Redireciona automaticamente para login
- ✅ Limpa dados antigos do localStorage
- ✅ Logs mais limpos (menos verbosos)

**Não há mais erros no console do servidor - apenas avisos informativos.**

---

## 🔍 Logs Esperados

**Antes (Muita informação):**
```
ERRO ao verificar o token: TokenExpiredError: jwt expired
    at C:\Users\...\jsonwebtoken\verify.js:190:21
    [... stack trace completo ...]
```

**Depois (Limpo e informativo):**
```
⚠️  Token expirado. Usuário precisa fazer login novamente.
```

---

## 🎯 Solução Imediata para Você

Para resolver o erro que você está vendo agora:

1. **No navegador:** Faça logout e login novamente
2. **Ou:** Limpe o localStorage:
   ```javascript
   // Cole isso no console do navegador (F12)
   localStorage.clear();
   location.reload();
   ```

**Pronto!** Um novo token válido será gerado no próximo login.

---

## 💡 Dica Extra

Para desenvolvimento, você pode aumentar temporariamente o tempo de expiração para não ter que fazer login constantemente:

```typescript
// Desenvolvimento (mais conveniente)
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

// Produção (mais seguro)
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
```

---

**Tudo pronto!** 🚀 O sistema agora trata tokens expirados de forma profissional e amigável ao usuário.
