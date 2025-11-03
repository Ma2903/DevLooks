# 🚀 Comandos de Instalação - DevLooks

## ⚡ Instalação Rápida

### 1. Instalar o Pacote do Google Gemini

Abra o PowerShell na pasta do projeto e execute:

```powershell
cd c:\Users\Mayara\Desktop\DevLooks\server
npm install @google/generative-ai
```

### 2. Configurar a Chave da API do Google Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada
4. Abra o arquivo `.env` na raiz do projeto (`c:\Users\Mayara\Desktop\DevLooks\.env`)
5. Adicione a linha:

```env
GEMINI_API_KEY=SUA_CHAVE_AQUI
```

### 3. Reiniciar o Servidor

```powershell
# Pare o servidor (Ctrl+C se estiver rodando)
# Depois reinicie:
npm run dev
```

---

## 🧪 Comandos de Teste

### Verificar se tudo está funcionando

```powershell
# Terminal 1 - Backend
cd c:\Users\Mayara\Desktop\DevLooks\server
npm run dev

# Terminal 2 - Frontend (em outra janela do PowerShell)
cd c:\Users\Mayara\Desktop\DevLooks
npm run dev
```

---

## 📦 Verificar Instalação do Pacote

Para confirmar que o `@google/generative-ai` foi instalado:

```powershell
cd c:\Users\Mayara\Desktop\DevLooks\server
npm list @google/generative-ai
```

Se instalado corretamente, você verá algo como:
```
@google/generative-ai@X.X.X
```

---

## 🔧 Problemas Comuns

### Erro: "GEMINI_API_KEY não configurada"

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Certifique-se de que a linha `GEMINI_API_KEY=...` está presente
3. Reinicie o servidor após adicionar a chave

### Erro de Compilação TypeScript

**Solução:**
```powershell
cd c:\Users\Mayara\Desktop\DevLooks\server
npm install --save-dev @types/node
```

---

## 🎯 Checklist de Instalação

- [ ] Pacote `@google/generative-ai` instalado
- [ ] Chave `GEMINI_API_KEY` adicionada ao `.env`
- [ ] Servidor reiniciado
- [ ] Frontend rodando
- [ ] Testado sistema de avaliações
- [ ] Testado notificações
- [ ] Testado resumo de IA

---

## 📞 Suporte

Se algo não estiver funcionando:

1. Verifique os logs do servidor no terminal
2. Abra o console do navegador (F12) para erros do frontend
3. Confirme que todas as variáveis de ambiente estão configuradas

**Tudo pronto!** 🎉
