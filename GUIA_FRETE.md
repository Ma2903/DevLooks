# 🚚 Guia de Solução de Problemas - Cálculo de Frete

## Problema: "Não está calculando o frete"

### ✅ Checklist de Verificação

#### 1. Servidor Backend Rodando
```bash
npm run server
```
- O servidor deve estar rodando na porta 3000 (ou conforme configurado no .env)
- Verifique se não há erros no console

#### 2. Arquivo .env Configurado
Verifique se existe o arquivo `.env` na raiz do projeto com:
```env
CORREIOS_CEP_ORIGEM=19200009
```

#### 3. Usuário Logado
- O endpoint `/api/shipping/calculate` requer autenticação
- Verifique se você está logado no sistema
- O token JWT deve estar válido (não expirado)

#### 4. CEP Válido
- O CEP deve ter 8 dígitos
- Pode ser no formato `12345-678` ou `12345678`
- Exemplos de CEPs válidos:
  - `01310-100` (Av. Paulista, São Paulo)
  - `20040-020` (Rio de Janeiro)
  - `30140-071` (Belo Horizonte)

---

## 🔍 Como Testar

### 1. Teste Manual via Frontend
1. Acesse a página do carrinho
2. Faça login (se necessário)
3. Digite um CEP válido no campo "Calcular Frete"
4. Clique no botão "Calcular"
5. Abra o Console do Navegador (F12) para ver logs

### 2. Teste via Console do Navegador
Abra o Console do Navegador (F12) e execute:

```javascript
// Buscar o cep do carrinho
const cart = document.querySelector('#cep');
console.log('Campo CEP:', cart);

// Testar chamada direta
fetch('http://localhost:3000/api/shipping/calculate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ cep: '01310-100' })
})
.then(r => r.json())
.then(data => console.log('✅ Resultado:', data))
.catch(err => console.error('❌ Erro:', err));
```

### 3. Teste via Postman/Insomnia
```
POST http://localhost:3000/api/shipping/calculate
Headers:
  Content-Type: application/json
  Authorization: Bearer SEU_TOKEN_AQUI
Body:
{
  "cep": "01310-100"
}
```

---

## ⚠️ Erros Comuns

### Erro: "CEP de destino é obrigatório"
**Causa:** Campo CEP vazio ou não enviado
**Solução:** Preencha o campo CEP antes de calcular

### Erro: "CEP deve conter 8 dígitos"
**Causa:** CEP incompleto ou inválido
**Solução:** Digite um CEP completo (8 dígitos)

### Erro: "Token não fornecido" ou 401
**Causa:** Usuário não está logado ou token expirou
**Solução:** Faça login novamente

### Erro: "Erro ao calcular frete para este CEP"
**Causa:** API dos Correios retornou erro (CEP inexistente, região sem cobertura, etc.)
**Solução:** Verifique se o CEP é válido no site dos Correios

### Erro: "Não foi possível calcular o frete"
**Causa:** Erro na comunicação com a API dos Correios
**Solução:** 
- Verifique sua conexão com a internet
- Tente novamente após alguns segundos
- API dos Correios pode estar instável

---

## 🐛 Debug Avançado

### Verificar Logs do Backend
Quando você tentar calcular o frete, o backend deve exibir no console:
```
🚚 Calculando frete de 19200009 para 01310100
📦 Resultado do cálculo: [...]
```

### Verificar Network do Navegador
1. Abra DevTools (F12)
2. Vá na aba "Network" (Rede)
3. Tente calcular o frete
4. Procure pela requisição `calculate`
5. Verifique:
   - Status Code (deve ser 200)
   - Request Headers (deve ter Authorization)
   - Request Payload (deve ter o CEP)
   - Response (deve ter cost, service, deliveryTime)

### Logs no Console do Navegador
O componente `Cart.vue` deve exibir:
- `❌ Erro ao calcular frete:` se houver erro
- Nenhum erro se tudo funcionar

---

## 📝 Notas Importantes

1. **Frete Grátis**: Se o subtotal for >= R$ 150,00, o frete é automaticamente definido como R$ 0,00

2. **Valores Hardcoded**: Atualmente o cálculo usa valores fixos:
   - Peso: 1 kg
   - Dimensões: 20x10x15 cm
   - Serviço: SEDEX (código 04014)

3. **CEP de Origem**: Configurado no .env como `CORREIOS_CEP_ORIGEM=19200009` (Pirapozinho, SP)

4. **API dos Correios**: Pode apresentar instabilidade ou lentidão em horários de pico

---

## 🚀 Funcionalidades Implementadas

✅ Aceita CEP com ou sem hífen  
✅ Remove formatação automaticamente  
✅ Valida se o CEP tem 8 dígitos  
✅ Exibe loading enquanto calcula  
✅ Mostra mensagens de erro claras  
✅ Aplica frete grátis para compras >= R$ 150  
✅ Bloqueia checkout se frete não for calculado (exceto frete grátis)  
✅ Passa os dados para o fluxo de checkout  

---

## 📞 Ainda com Problemas?

1. Reinicie o servidor backend
2. Limpe o cache do navegador (Ctrl + Shift + Delete)
3. Faça logout e login novamente
4. Verifique se o MongoDB está rodando
5. Verifique os logs do servidor para erros

Se o problema persistir, verifique:
- O pacote `node-correios` está instalado? (`npm list node-correios`)
- O arquivo `server/types/node-correios.d.ts` existe?
- O arquivo `.env` existe e está na raiz do projeto?
