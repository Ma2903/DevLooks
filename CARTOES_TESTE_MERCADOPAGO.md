# Cartões de Teste - Mercado Pago

## ⚠️ IMPORTANTE
Estes cartões só funcionam em **ambiente de teste**. Para usar:
1. Você precisa ter credenciais de TESTE (não produção)
2. Acesse: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

## 💳 Cartões de Teste Aprovados

### Mastercard
```
Número: 5031 4332 1540 6351
CVV: 123
Data de validade: Qualquer data futura (ex: 11/25)
Nome: APRO (aprova qualquer valor)
```

### Visa
```
Número: 4509 9535 6623 3704
CVV: 123
Data de validade: Qualquer data futura
Nome: APRO
```

### American Express
```
Número: 3711 803032 57522
CVV: 1234
Data de validade: Qualquer data futura
Nome: APRO
```

## 🔴 Cartões para Testar Rejeição

### Fundos Insuficientes
```
Número: 5031 4332 1540 6351
Nome: FUND
```

### Rejeição Genérica
```
Número: 5031 4332 1540 6351
Nome: OTHE
```

## 📧 Dados do Comprador para Teste
```
Email: test_user_123456@testuser.com
CPF: 123.456.789-00 (qualquer CPF válido)
Telefone: (11) 98765-4321
```

## 🔧 Como Usar Credenciais de Teste

### 1. Obter Access Token de Teste
1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Clique na sua aplicação
3. Vá em "Credenciais de teste"
4. Copie o **Access Token de Teste**

### 2. Configurar no Render
- Troque `MERCADOPAGO_ACCESS_TOKEN` pelo token de TESTE
- Após testar, volte para o token de PRODUÇÃO

## ⚡ Teste Rápido

1. Vá até o checkout
2. Use um dos cartões acima
3. Preencha com nome "APRO"
4. O pagamento será aprovado instantaneamente
5. Verifique o webhook e a criação do pedido

## 🚨 Lembrete
- **PRODUÇÃO**: Use o token que começa com `APP_USR-2527278991117877...`
- **TESTE**: Use o token de teste da sua conta
- Nunca compartilhe seus tokens de produção publicamente!

## 📚 Documentação Oficial
https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing/test-cards
