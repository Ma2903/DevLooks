# 🚀 Guia de Execução - DevLooks

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- ✅ Node.js (v16 ou superior)
- ✅ MongoDB (local ou Atlas)
- ✅ npm ou yarn
- ✅ Git

---

## 📦 Instalação

### 1. Instalar Dependências

#### Backend
```powershell
cd c:\Users\Mayara\Desktop\DevLooks\server
npm install
```

#### Frontend
```powershell
cd c:\Users\Mayara\Desktop\DevLooks
npm install
```

---

## ⚙️ Configuração

### 1. Arquivo .env

Certifique-se de que o arquivo `.env` na raiz do projeto está configurado:

```env
# Banco de Dados
MONGO_URI="mongodb+srv://manoelaps2022:0401@cluster0.sw7hdna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Autenticação
JWT_SECRET="sua_chave_super_secreta_aqui_12345"
CRYPTO_SECRET="outra_chave_secreta_para_cryptojs_67890"

# Email
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="godlolpro32@gmail.com"
MAIL_PASS="ieil edjw hbcu tnqc"

# Servidor
PORT=3000

# Proprietário do Sistema
OWNER_EMAIL="manoela2903@outlook.com"

# Configuração dos Correios
CORREIOS_CEP_ORIGEM="19200009"

# Google Gemini AI
GEMINI_API_KEY=AIzaSyCCDic0dsi4FcSVCqVLCDLnC5-vROgwR1I

# Mercado Pago (opcional)
MERCADOPAGO_ACCESS_TOKEN="APP_USR-2527278991117877-102021-f0327e03ea48f78a1f760a5ad5276ac7-2937731178"
```

---

## 🏃 Executando o Projeto

### Opção 1: Rodar Backend e Frontend Separadamente

#### Terminal 1 - Backend
```powershell
cd c:\Users\Mayara\Desktop\DevLooks\server
npm run dev
```

**Deve aparecer:**
```
✅ API Rodando em http://localhost:3000
```

#### Terminal 2 - Frontend
```powershell
cd c:\Users\Mayara\Desktop\DevLooks
npm run dev
```

**Deve aparecer:**
```
VITE ready in XXXms
Local: http://localhost:5173/
```

### Opção 2: Script Único (se configurado)

```powershell
cd c:\Users\Mayara\Desktop\DevLooks
npm run fullstack
```

---

## 🧪 Testando as Novas Funcionalidades

### 1. Sistema de Avaliações

1. **Acesse:** http://localhost:5173/
2. **Faça login** com um usuário comum
3. **Compre um produto** (finalize o checkout)
4. **Como admin**, mude o status do pedido para "Entregue"
5. **Volte como usuário comum** e acesse a página do produto
6. **Veja o formulário de avaliação** aparecer
7. **Avalie o produto** (estrelas + comentário)
8. **Veja a avaliação** aparecer na lista

**Para testar IA:**
- Crie pelo menos 2 avaliações
- O resumo por IA aparecerá automaticamente
- Análise de sentimentos será exibida

### 2. Cupom Case-Insensitive

1. **Como admin**, crie um cupom: "DESC10"
2. **Como usuário**, adicione produtos ao carrinho
3. **No carrinho**, tente aplicar:
   - `desc10` ✅
   - `Desc10` ✅
   - `DESC10` ✅
   - `DeSc10` ✅

### 3. Frete Dinâmico

1. **Adicione produtos ao carrinho**
2. **Digite um CEP** (ex: 01310-100)
3. **Clique em "Calcular Frete"**
4. **Abra o Console (F12)** para ver os logs:
   ```
   📦 Peso total do carrinho: 1.50 kg
   📏 Dimensões máximas: {height: 10, width: 15, length: 20}
   ✅ Frete calculado para São Paulo - Capital: R$ 16.00 - 3-5 dias úteis
   ```

---

## 🛠️ Comandos Úteis

### Desenvolvimento

```powershell
# Backend com hot reload
cd server
npm run dev

# Frontend com hot reload
cd c:\Users\Mayara\Desktop\DevLooks
npm run dev
```

### Build para Produção

```powershell
# Frontend
npm run build

# Backend (TypeScript para JavaScript)
cd server
npm run build
```

### Limpeza

```powershell
# Limpar node_modules
rm -r node_modules
rm -r server/node_modules

# Reinstalar
npm install
cd server && npm install
```

---

## 📂 Estrutura de Pastas

```
DevLooks/
├── server/              # Backend (Express + TypeScript)
│   ├── controllers/     # Lógica de negócio
│   ├── models/          # Schemas do MongoDB
│   ├── routes/          # Rotas da API
│   ├── services/        # Serviços (IA, Notificações)
│   └── index.ts         # Ponto de entrada
├── view/                # Frontend (Vue 3)
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   └── services/        # Serviços (API, Axios)
├── public/              # Arquivos estáticos (imagens)
├── .env                 # Variáveis de ambiente
└── package.json         # Dependências
```

---

## 🔍 Verificando se Tudo Está Funcionando

### Backend

**URL:** http://localhost:3000/

**Endpoints Principais:**
- `GET /api/products` - Lista produtos
- `GET /api/products/:id/reviews` - Lista avaliações
- `POST /api/products/:id/reviews` - Adiciona avaliação (requer auth)
- `POST /api/shipping/calculate` - Calcula frete (requer auth)
- `POST /api/cart/add` - Adiciona ao carrinho (requer auth)

**Teste rápido no navegador:**
```
http://localhost:3000/api/products
```
Deve retornar um JSON com a lista de produtos.

### Frontend

**URL:** http://localhost:5173/

**Páginas Principais:**
- `/` - Home
- `/products` - Lista de produtos
- `/products/:id` - Detalhes do produto (com reviews)
- `/cart` - Carrinho
- `/login` - Login
- `/admin/products` - Admin: Gerenciar produtos

---

## 🐛 Solucionando Problemas

### Erro: "Cannot connect to MongoDB"

**Solução:**
- Verifique se a URI do MongoDB no `.env` está correta
- Teste a conexão com MongoDB Compass

### Erro: "GEMINI_API_KEY não configurada"

**Solução:**
- Adicione `GEMINI_API_KEY` ao `.env`
- Reinicie o servidor backend

### Erro: "Port 3000 already in use"

**Solução:**
```powershell
# Encontre o processo
netstat -ano | findstr :3000

# Mate o processo
taskkill /PID <PID> /F

# Ou mude a porta no .env
PORT=3001
```

### Erro: "Token expired"

**Solução:**
- É normal após algum tempo
- Faça logout e login novamente
- O token JWT expira após um período

---

## 📊 Logs Importantes

### Backend

**Você deve ver:**
```
✅ API Rodando em http://localhost:3000
✅ Conectado ao MongoDB
```

**Durante uso:**
```
[Checkout Log] Total calculado: 150.00
📦 Peso adicional: 0.50kg - Taxa extra: R$ 1.00
✅ Frete calculado para São Paulo - Capital: R$ 16.00 - 3-5 dias úteis
```

### Frontend (Console do Navegador)

**F12 → Console:**
```
✅ Frete calculado: {cost: 16, deliveryTime: "3-5 dias úteis", region: "São Paulo"}
📦 Peso total do carrinho: 1.50 kg
```

---

## 🎯 Fluxo Completo de Teste

### Passo a Passo:

1. ✅ **Inicie Backend e Frontend**
2. ✅ **Acesse** http://localhost:5173/
3. ✅ **Cadastre um usuário**
4. ✅ **Faça login**
5. ✅ **Navegue pelos produtos**
6. ✅ **Adicione produtos ao carrinho**
7. ✅ **Calcule o frete** (digite CEP)
8. ✅ **Aplique um cupom** (teste case-insensitive)
9. ✅ **Finalize a compra**
10. ✅ **Como admin**, mude o status para "Entregue"
11. ✅ **Como usuário**, avalie o produto
12. ✅ **Veja o resumo por IA** (após 2+ avaliações)

---

## 📝 Checklist de Funcionamento

Antes de considerar concluído, verifique:

- [ ] Backend rodando sem erros
- [ ] Frontend rodando sem erros
- [ ] Banco de dados conectado
- [ ] Login funcionando
- [ ] Cadastro de produtos funcionando
- [ ] Carrinho funcionando
- [ ] Cálculo de frete funcionando
- [ ] Sistema de avaliações funcionando
- [ ] IA gerando resumos
- [ ] Cupons funcionando (case-insensitive)
- [ ] Admin pode gerenciar tudo
- [ ] Notificações funcionando

---

## 🚀 Pronto para Produção?

Antes do deploy:

1. [ ] Mude `JWT_SECRET` para um valor seguro
2. [ ] Configure CORS corretamente
3. [ ] Altere URLs hardcoded (localhost → domínio)
4. [ ] Configure variáveis de ambiente no servidor
5. [ ] Faça backup do banco de dados
6. [ ] Teste tudo em ambiente de staging
7. [ ] Configure SSL/HTTPS
8. [ ] Configure webhook do Mercado Pago

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** (backend e frontend)
2. **Abra o Console do navegador** (F12)
3. **Leia a documentação:** `IMPLEMENTACOES_FINAIS.md`
4. **Use o checklist:** `CHECKLIST_TESTES.md`

---

**Desenvolvido por:** GitHub Copilot  
**Projeto:** DevLooks - E-commerce para Desenvolvedores  
**Data:** 03 de Novembro de 2025
