# 🛒 Problema: Pedidos Não Salvavam no Banco de Dados

## 🔍 Diagnóstico do Problema

Quando um cliente realizava uma compra:
- ✅ O pagamento era cobrado no Mercado Pago
- ✅ O cliente era redirecionado para a página de "Pagamento Bem-Sucedido"
- ❌ **MAS** o pedido **NÃO** era salvo no banco de dados

---

## 🐛 Causa Raiz

O problema estava na **incompatibilidade entre o schema do OrderModel e os dados enviados pelo PaymentController**.

### Schema Original do OrderModel

```typescript
// ❌ ANTES (PROBLEMÁTICO)
export interface IOrderItem {
    productId: Schema.Types.ObjectId;  // Campo obrigatório
    name: string;                       // Campo obrigatório
    image: string;                      // Campo obrigatório
    // ...
}

status: {
    enum: ['Aguardando Pagamento', 'Processando', 'Enviado', 'Entregue', 'Cancelado']
    // ❌ NÃO permitia 'paid', 'pending', etc.
}

// ❌ NÃO tinha os campos:
// - paymentMethod
// - paymentStatus
// - mercadoPagoPaymentId
```

### Dados Enviados pelo PaymentController

```typescript
// ❌ O que o controller tentava salvar
{
    items: [{
        product: "123abc",     // ❌ Campo não esperado
        quantity: 1,
        price: 49.90,
        // ❌ Faltava: name, image
    }],
    status: 'paid',            // ❌ Valor não permitido no enum
    paymentMethod: 'pix',      // ❌ Campo não existia no schema
    paymentStatus: 'approved', // ❌ Campo não existia no schema
    mercadoPagoPaymentId: '456' // ❌ Campo não existia no schema
}
```

**Resultado**: MongoDB **rejeitava** a inserção por violar o schema.

---

## ✅ Solução Implementada

### 1. **Atualização do OrderModel**

```typescript
// ✅ DEPOIS (CORRIGIDO)
export interface IOrderItem {
    product?: Schema.Types.ObjectId;     // ✅ Agora aceita 'product'
    productId?: Schema.Types.ObjectId;   // ✅ Retrocompatibilidade
    name?: string;                        // ✅ Opcional
    image?: string;                       // ✅ Opcional
    quantity: number;                     // ✅ Obrigatório
    price: number;                        // ✅ Obrigatório
    selectedSize?: string;                // ✅ Opcional
}

export interface IOrder {
    // ... campos existentes
    status: 'Aguardando Pagamento' | 'Processando' | 'Enviado' | 
            'Entregue' | 'Cancelado' | 
            'paid' | 'pending' | 'cancelled' | 'refunded';  // ✅ Novos status
    
    // ✅ Novos campos opcionais
    paymentMethod?: string;
    paymentStatus?: string;
    mercadoPagoPaymentId?: string;
}
```

### 2. **Correção no PaymentController**

```typescript
// ✅ Agora popula TODOS os dados necessários
orderItems.push({
    product: product._id,          // ✅ ID do produto
    productId: product._id,        // ✅ Compatibilidade
    name: product.name,            // ✅ Nome completo
    quantity: quantity,
    price: product.promotion_price || product.price,
    image: product.image,          // ✅ Imagem do produto
    selectedSize: item.selectedSize || undefined  // ✅ Tamanho (se houver)
});
```

### 3. **Melhoria no Metadata do Checkout**

```typescript
// ✅ Agora envia selectedSize junto com os items
metadata: {
    shipping_address: JSON.stringify(shippingAddress),
    items: JSON.stringify(items.map(item => ({
        product: typeof item.product === 'object' ? item.product._id : item.product,
        quantity: item.quantity,
        selectedSize: item.selectedSize  // ✅ Tamanho da camiseta
    })))
}
```

---

## 🔄 Fluxo Correto Agora

1. **Cliente faz checkout** → Cria preferência no Mercado Pago
2. **Cliente paga** → Mercado Pago notifica via webhook
3. **Webhook recebe notificação** → `PaymentController.webhook()`
4. **Se status = 'approved'**:
   - ✅ Busca dados do produto no banco
   - ✅ Popula item com: `name`, `image`, `price`, `selectedSize`
   - ✅ Cria pedido no `OrderModel` com status `'paid'`
   - ✅ Reduz estoque dos produtos
   - ✅ Limpa carrinho do usuário
   - ✅ Envia notificação ao cliente
5. **Cliente vê pedido** em "Minhas Compras"

---

## 🧪 Como Testar

### 1. Verificar Logs do Webhook

No console do servidor, procure por:

```
🔔🔔🔔 [Webhook] ========================================
🔔 [Webhook] NOTIFICAÇÃO RECEBIDA DO MERCADO PAGO!
📊 [Webhook] Status do pagamento: approved
📦 [CreateOrder] Criando pedido para usuário 123abc
✅ [CreateOrder] Pedido criado com sucesso: 789xyz
```

### 2. Verificar Banco de Dados

Conecte ao MongoDB e verifique a collection `orders`:

```javascript
db.orders.find({ mercadoPagoPaymentId: "SEU_PAYMENT_ID" })
```

Deve retornar um pedido com:
- ✅ `items` com `name`, `image`, `price`
- ✅ `status: 'paid'`
- ✅ `paymentMethod`, `paymentStatus`, `mercadoPagoPaymentId`

### 3. Verificar na Interface

1. Faça uma compra de teste
2. Após aprovação, vá em **"Minhas Compras"**
3. O pedido deve aparecer lá

---

## 📌 Observações Importantes

### Webhook do Mercado Pago

O webhook **DEVE** estar configurado no painel do Mercado Pago:

- **URL**: `https://devlooks.onrender.com/api/payment/webhook`
- **Eventos**: Pagamentos (`payment`)

### Status do Pedido

O sistema agora aceita dois "conjuntos" de status:

- **Status legados**: `'Processando'`, `'Enviado'`, `'Entregue'`, `'Cancelado'`
- **Status do MP**: `'paid'`, `'pending'`, `'cancelled'`, `'refunded'`

Recomenda-se padronizar no futuro para usar apenas um conjunto.

---

## ✅ Checklist de Verificação

- [x] Schema do `OrderModel` atualizado
- [x] `PaymentController` popula todos os campos necessários
- [x] Metadata do checkout inclui `selectedSize`
- [x] Logs detalhados no webhook
- [x] Estoque é reduzido após pagamento
- [x] Carrinho é limpo após pagamento
- [x] Cliente recebe notificação

---

## 🚀 Próximos Passos (Opcional)

1. **Padronizar status**: Escolher entre status PT-BR ou EN
2. **Testes automáticos**: Criar testes para o fluxo de webhook
3. **Monitoramento**: Adicionar alertas para falhas no webhook
4. **Retry logic**: Implementar retry caso criação do pedido falhe
