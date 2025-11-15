# 🚀 Configuração do Render para DevLooks Backend

## ⚙️ Configurações do Serviço

### Build Command:
```bash
npm install && npm run server:build
```

### Start Command:
```bash
npm run server:start
```

### Environment:
- **Node**

### Branch:
- **main**

---

## 📋 Variáveis de Ambiente

Adicione estas variáveis no painel do Render (**Environment** → **Environment Variables**):

| Name | Value | Observação |
|------|-------|------------|
| `MONGO_URI` | `mongodb+srv://manoelaps2022:0401@cluster0.sw7hdna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` | MongoDB Atlas |
| `JWT_SECRET` | `sua_chave_super_secreta_aqui_12345` | Segredo JWT |
| `CRYPTO_SECRET` | `outra_chave_secreta_para_cryptojs_67890` | Segredo Crypto |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP Gmail |
| `MAIL_PORT` | `587` | Porta SMTP |
| `MAIL_USER` | `manoelaps2022@gmail.com` | Email remetente |
| `MAIL_PASS` | `nkip kkxu zigy gody` | App Password Gmail |
| `OWNER_EMAIL` | `manoela2903@outlook.com` | Email admin |
| `PORT` | `3000` | Porta (Render define automaticamente) |
| `GEMINI_API_KEY` | `AIzaSyCCDic0dsi4FcSVCqVLCDLnC5-vROgwR1I` | Google Gemini |
| `MERCADOPAGO_ACCESS_TOKEN` | `APP_USR-2527278991117877-102021-f0327e03ea48f78a1f760a5ad5276ac7-2937731178` | Mercado Pago PROD |

---

## 📁 Arquivos Estáticos (IMPORTANTE!)

O Render **DEVE** incluir a pasta `public` no deploy. Verifique:

1. A pasta `public` **NÃO deve** estar no `.gitignore`
2. Após o deploy, verifique nos logs se aparecem as mensagens:
   ```
   📁 Tentando servir arquivos estáticos de:
      Path 1: /opt/render/project/src/dist/../public
      Path 2: /opt/render/project/src/dist/../../public
      Path 3: /opt/render/project/src/public
   ```

3. Se as imagens não carregarem, acesse no navegador:
   ```
   https://devlooks.onrender.com/images/products/moletom_git.png
   ```
   
   **Deve mostrar a imagem**, não um erro 404!

---

## 🔍 Troubleshooting

### Imagens não aparecem (404):

1. **Verifique se `public` está no repositório:**
   ```bash
   git ls-files | grep public
   ```
   
2. **Adicione a pasta public explicitamente:**
   ```bash
   git add public/
   git commit -m "Adicionar pasta public com imagens"
   git push
   ```

3. **Verifique os logs do Render:**
   - Procure por erros relacionados a `ENOENT` ou `Cannot find module`

### Build falha:

1. Verifique se `typescript` está instalado:
   ```bash
   npm install --save-dev typescript
   ```

2. Confirme que `tsconfig.json` tem `outDir` configurado

### Port já em uso:

O Render define a porta automaticamente via variável `PORT`. Não force porta 3000.

---

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Render
- [ ] Build Command: `npm install && npm run server:build`
- [ ] Start Command: `npm run server:start`
- [ ] Pasta `public` commitada no Git
- [ ] Webhook Mercado Pago configurado: `https://devlooks.onrender.com/api/payment/webhook`
- [ ] MongoDB Atlas aceita conexões de `0.0.0.0/0`
- [ ] Teste manual de imagem: `https://devlooks.onrender.com/images/products/moletom_git.png`

---

## 🎯 Próximos Passos

Após configurar o Render:

1. Aguarde o deploy terminar
2. Teste a API: `https://devlooks.onrender.com/api/products`
3. Teste uma imagem: `https://devlooks.onrender.com/images/products/moletom_git.png`
4. Se funcionar, faça redeploy do Vercel para conectar ao backend
